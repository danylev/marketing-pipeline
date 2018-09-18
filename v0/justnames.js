require('dotenv').config()

const fs = require('fs')
const Nick = require('nickjs')
const nick = new Nick({
    loadImages: true,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:54.0) Gecko/20100101 Firefox/54.0",
    printPageErrors: false,
    printResourceErrors: false,
    printNavigation: false,
    printAborts: false,
    debug: false,
})
// }

const getUsername = (arg, callback) => {
    callback(null, document.querySelector("button > div.avatar > img.avatar-image").alt)
}

const mediumConnect = async (uid, sid, tab) => {
    console.log("Connecting to Medium...", "loading")
    await nick.setCookie({
        name: "uid",
        value: uid,
        domain: ".medium.com",
        secure: true,
        httpOnly: true
    })
    await nick.setCookie({
        name: "sid",
        value: sid,
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
        const timeLeft = await console.checkTimeLeft()
        if (!timeLeft.timeLeft) {
            console.log(`Stopped loading the clappers: ${timeLeft.message}`, "warning")
            load = false
        }
    }
}

const getClappers = async (url, tab) => {
    await tab.open(url)
    await tab.waitUntilVisible("button.js-multirecommendCountButton")
    await tab.wait(1000)
    await tab.click("button.js-multirecommendCountButton")
    await tab.waitUntilVisible("div.overlay-content")
    await loadAllClappers(tab)
    return tab.evaluate(scrapeClappers)
}

;(async () => {
    const tab = await nick.newTab()
    let articles = require('./articles.json').articles 
    await mediumConnect(process.env.MEDIUM_UID, process.env.MEDIUM_SID, tab)
    let result = []
    for (const article of articles) {
        console.log(article)
        console.log(`Scrapping article ${article}...`, "loading")
        result.push({ url: article, clappers: await getClappers(article, tab) })
        console.log(`${article} scrapped.`, "done")
    }
    let dataToWrite = JSON.stringify(result, null, 2) 
    fs.writeFileSync('./names.json', dataToWrite)
    nick.exit()
})()
.catch(err => {
    console.log(err, "error")
    nick.exit(1)
})
