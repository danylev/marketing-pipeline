// Phantombuster configuration {
"phantombuster command: nodejs"
"phantombuster package: 4"
"phantombuster dependencies: lib-StoreUtilities.js"
"phantombuster flags: save-folder"

const Buster = require("phantombuster")
const buster = new Buster()

const Nick = require("nickjs")
const nick = new Nick({
	loadImages: true,
	userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
	// printPageErrors: false,
	// printResourceErrors: false,
	// printNavigation: false,
	// printAborts: false,
	// debug: false,
})

const StoreUtilities = require("./lib-StoreUtilities")
const utils = new StoreUtilities(nick, buster)
// }

const instagramConnect = async (tab, sessionCookie) => {
	utils.log("Connecting to instagram...", "loading")
	await nick.setCookie({
		name: "sessionid",
		value: sessionCookie,
		domain: "www.instagram.com",
		secure: true,
		httpOnly: true
	})
	await tab.open("instagram.com")
	try {
		await tab.waitUntilVisible("#mainFeed")
		utils.log("Connected to Instagram successfully.", "done")
	} catch (error) {
		throw "Could not connect to Instagram with that sessionCookie."
	}
}

const getRecentsDivNb = (arg, callback) => {
	callback(null, document.querySelectorAll("article._jzhdd > div:not(._21z45) > div._cmdpi > div._70iju > ._mck9w").length)
}

const loadPosts = async (tab, n) => {
	let length = await tab.evaluate(getRecentsDivNb)
	while (length < n) {
		utils.log(`Loaded ${length} posts.`, "info")
		await tab.scrollToBottom()
		await tab.wait(2000)
		if (length === await tab.evaluate(getRecentsDivNb)) {
			break
		}
		length = await tab.evaluate(getRecentsDivNb)
	}
	utils.log(`Loaded ${length} posts.`, "done")
}

const setClasses = (arg, callback) => {
	const recent = document.querySelectorAll("article._jzhdd > div:not(._21z45) > div._cmdpi > div._70iju > ._mck9w")
	let i = 0
	for (const div of recent) {
		if (i < arg.n) {
			div.classList.add(`phclass${i}`)
			i++
		} else {
			break
		}
	}
	callback()
}

const likePosts = async (tab, max, message) => {
	for (let i = 0; i < max; i++) {
		try {
			await tab.click(`.phclass${i} a`)
			utils.log(`Liking post ${i+1}`, "loading")
			await tab.wait(2000)
			await tab.click("._eszkz")
			await tab.sendKeys("textarea._bilrf", message)
			await tab.wait(2000)
			await tab.screenshot(`screen${i}.jpg`)
			await tab.click("button._dcj9f")
			utils.log(`Post ${i+1} liked.`, "done")
		} catch (error) {
			console.log(error)
			break
		}
	}
}

;(async () => {
	const tab = await nick.newTab()
	const [sessionCookie, tag, limit, message] = utils.checkArguments([
		{name: "sessionCookie", type: "string", length: 20},
		{name: "tag", type: "string", length: 1},
		{name: "limit", type: "number", default: 5},
		{name: "message", type: "string", default: ""}
	])
	await instagramConnect(tab, sessionCookie)
	console.log(1)
	await tab.open("https://www.facebook.com/")
	// await tab.open(`https://www.instagram.com/explore/tags/${tag}/`)
	console.log(2)
	await tab.waitUntilVisible("img._2di5p")
	console.log(3)
	await loadPosts(tab, limit)
	console.log(4)
	await tab.evaluate(setClasses, {n: limit})
	const result = await likePosts(tab, limit, message)
	nick.exit()
})()
.catch(err => {
	utils.log(err, "error")
	nick.exit(1)
})