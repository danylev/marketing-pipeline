const Nick = require("../../lib/Nick")
const nick = new Nick({
	headless: false,
	debug: true
})

const instagramConnect = async (tab, sessionCookie) => {
	console.log("Connecting to instagram...")
	await nick.setCookie({
		name: "sessionid",
		value: sessionCookie,
		domain: "www.instagram.com",
		secure: true,
		httpOnly: true
	})
	await tab.open("instagram.com")
	try {
		await tab.waitUntilVisible("body span section main section div div div div article")
		console.log("Connected to Instagram successfully.")
	} catch (error) {
		throw "Could not connect to Instagram with that sessionCookie."
	}
}

;(async () => {

	const tab = await nick.newTab()

	await instagramConnect(tab, "IGSC186521252a0112ace5cc0657de5d0d6d9a0cb9afa213efa78538a0b1d24b8549%3A0fwAAXNrJaLrMcqXEzZBAwuoRhL1jHuG%3A%7B%22_auth_user_id%22%3A1383862544%2C%22_auth_user_backend%22%3A%22accounts.backends.CaseInsensitiveModelBackend%22%2C%22_auth_user_hash%22%3A%22%22%2C%22_token_ver%22%3A2%2C%22_token%22%3A%221383862544%3A4rncsxUsN4zbBlln3spqk2quw9Ffzhhw%3A5fbedf26a0840d17a946bfb0cff08eb94d1097f10910165731e8f50f98428612%22%2C%22_platform%22%3A4%2C%22last_refreshed%22%3A1512551815.9365186691%7D")

	await tab.wait(5000)

	await tab.open('ipinfo.io')

	await tab.wait(10000)

	nick.exit()

})()
.catch((err) => {
	console.log(`Oops, something went wrong: ${err}`)
	nick.exit(1)
})
