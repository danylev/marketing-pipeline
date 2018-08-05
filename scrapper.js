
require('dotenv').config()

const fs = require('fs')
const WebSearch = require('./lib-WebSearch')
const Nick = require('nickjs')
const nick = new Nick({
    loadImages: true,
    userAgent:  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:54.0) Gecko/20100101 Firefox/54.0",
    printPageErrors: false,
    printResourceErrors: false,
    printNavigation: false,
    printAborts: false,
    debug: false,
})


const getUsername = (arg, callback) => {
    callback(null, document.querySelector("button > div.avatar > img.avatar-image").alt)
}

const mediumConnect = async (tab) => {
    console.log('Connectin to Medium')
    await nick.setCookie({
        name: "uid",
        value: process.env.MEDIUM_UID,
        domain: ".medium.com",
        secure: true,
        httpOnly: true
    })
    await nick.setCookie({
        name: "sid",
        value: process.env.MEDIUM_SID,
        domain: ".medium.com",
        secure: true,
        httpOnly: true
    })
    await tab.open("https://medium.com/")
    try {
        await tab.waitUntilVisible("button > div.avatar")
        console.log(`Successfully connected to Medium as ${await tab.evaluate(getUsername)}`, "done")
    } catch (error) {
        console.log("Could not connect to Medium.", "error")
        await tab.screenshot("error.jpg")
        nick.exit(1)
    }
}
//
const loadAllClappers = async tab => {
    let length = await tab.evaluate((arg, callback) => { callback(null, document.querySelectorAll("ul.list > li").length) })
    let load = true
    console.log("Loading clappers...", "loading")
    while (load) {
        await tab.click("button[data-action=\"show-more-recommends\"]")
        try {
            await tab.waitUntilVisible(`ul.list > li:nth-of-type(${length+1})`)
            length = await tab.evaluate((arg, callback) => { callback(null, document.querySelectorAll("ul.list > li").length) })
            console.log(`Loaded ${length} clappers.`, "info")
        } catch (error) {
            console.log("Loaded all clappers for this post.", "done")
            load = false
        }
    }
}
//
const scrapeClappers = (arg, callback) => {
    const clappers = document.querySelectorAll("ul.list > li.list-item")
    const result = []
    for (const clapper of clappers) {
        const people = {
            profileUrl: clapper.querySelector("div.u-flex1 a.link").href
        }
        if (clapper.querySelector("div.u-flex1 > p")) {
            people.name = clapper.querySelector("div.u-flex1 a.link").textContent.trim()
            if (clapper.querySelector("div.u-flex1 p")) { people.description = clapper.querySelector("div.u-flex1 p").textContent.trim() }
        } else {
            people.name = clapper.querySelector("div.u-flex1 a.link").firstChild.data
            if (clapper.querySelector("div.u-flex1 a.link p")) { people.description = clapper.querySelector("div.u-flex1 a.link p").textContent.trim() }
        }
        result.push(people)
    }
    callback(null, result)
}
//
const getClappers = async (url, tab) => {
    await tab.open(url)
    await tab.waitUntilVisible("button.js-multirecommendCountButton")
    await tab.wait(1000)
    await tab.click("button.js-multirecommendCountButton")
    await tab.waitUntilVisible("div.overlay-content")
    await loadAllClappers(tab)
    return tab.evaluate(scrapeClappers)
}
//
const getId = async (tab, url) => {
    const selector = "form.i-amphtml-form"
    try {
        await tab.open("https://findmyfbid.com/")
        await tab.waitUntilVisible(selector)
        await tab.fill(selector, {url: url}, {submit: false})
        await tab.click("input[type=\"submit\"]")
        const resultSelector = await tab.waitUntilVisible(["#success-wrap", ".text-danger"], 20000, "or")
        if (resultSelector === "#success-wrap") {
            return (await tab.evaluate(scrapeId))
        }
        return false
    } catch (e) {
        console.log(`Error: ${e}`, "error")
        return false
    }
}
//
const gatherClappersInfo = async (article, file, tab) => {
    let stored = require('./'+file.split('.')[0])
    if (stored) {
        console.log('Finded stored', file)
        return stored.clappers.map(person => person.name)
    }
    await mediumConnect(tab)
    console.log('Scrapping data from medium!')
    let clappers = {url:article, clappers: await getClappers(article, tab)}
    let dataToWrite = JSON.stringify(clappers,null, 2)
    let persons = clappers.clappers
    fs.writeFileSync(file, dataToWrite)
    return persons.map(person => person.name)
}
//
const gatherFacebookUrls = async (urls, file, tab) => {
    let stored = require('./'+file.split('.')[0])
    console.log(stored)
    if (stored) {
        console.log('Finded stored', file)
        return stored.map(person => person.facebookUrl)
    }
    const webSearch = new WebSearch(tab)
    const facebookUrls = []
    if (urls.length < 1) {
        console.log("Input is empty OR all queries are already scraped", "warning")
        nick.exit(0)
    }
    for (const one of urls) {
        console.log(`Searching for ${one} ...`, "loading")
        let search = await webSearch.search(one + " site:facebook.com")
        let link = null
        for (const res of search.results) {
            if (res.link.match(/^(?:(?:(http|https)):\/\/)?(?:www\.|[a-z]{1,}-[a-z]{1,}\.)?(?:facebook.com)\/[^public][a-zA-Z0-9-_.]{1,}/g)) {
                link = res.link
                break
            }
        }
        if (link) {
            console.log(`Got ${link} for ${one} (${search.codename})`, "done")
        } else {
            link = "no url"
            console.log(`No result for ${one} (${search.codename})`, "done")
        }
        facebookUrls.push({ facebookUrl: link, query: one })
    }
    let dataToWrite = JSON.stringify(facebookUrls,null, 2)
    fs.writeFileSync(file, dataToWrite)
    return facebookUrls.map(person => person.facebookUrl)
}
//
const gatherFacebookIDs = async (urls, file, tab) => {
    let facebookIDs = []
    try {
        let stored = require('./'+file.split('.')[0])
        if (stored) {
            console.log('Finded stored', file)
            return stored.map(person => person.facebookID)
        }
    }
    catch(error) {
        for (const link of urls) {
            if (link) {
                console.log(`Getting the ID for url:${link}...`, "loading")
                const id = await getId(tab, link)
                if (id === false) {
                    console.log(`Could not get the id for ${link}, profile might be protected.`, "warning")
                    facebookIDs.push({error: "Could not find the ID: profile protected.", originalUrl: link})
                } else {
                    console.log(`Got ID: ${id} for ${link}`, "done")
                    facebookIDs.push({url: "https://www.facebook.com/" + id, id, originalUrl: link})
                }
            } else {
                console.log("Empty line... skipping entry", "warning")
            }
        }
        let dataToWrite = JSON.stringify(facebookIDs,null, 2)
        fs.writeFileSync(file, dataToWrite)
        return 0
    }
}
//
;(async() => {
    const tab = await nick.newTab()
    let spreadsheetUrls = process.env.LIST_URL
    names = await gatherClappersInfo(spreadsheetUrls, 'clappers.json', tab)
    urls = await gatherFacebookUrls(names, 'faceurls.json', tab)
    ids = await gatherFacebookIDs(urls, 'facebookids.json', tab)
    nick.exit()
})()
.catch(err => {
    console.log(err, "error")
    nick.exit(1)
})