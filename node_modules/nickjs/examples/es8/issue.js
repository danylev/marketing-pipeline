const CDP = require("chrome-remote-interface")
const Promise = require("bluebird")

const chromeFlags = [
	'--remote-debugging-port=9222',
	"--enable-logging",
	"--v=1",
	"--headless",
]

const child = require("child_process").spawn("google-chrome-beta", chromeFlags, {
	stdio: 'pipe', // change this to 'ignore' and Chrome doesn't crash
})
child.stdout.on('data', () => { });
child.stderr.on('data', () => { });
process.on("exit", () => { child.kill() })
setTimeout(() => { runTest() }, 1000) // give time for Chrome to start

const newTab = async (callback) => {
	return new Promise((resolve, reject) => {
		CDP.New((err, tab) => {
			if (err) {
				console.log(`cannot create new chrome tab: ${err}`)
				process.exit(1)
			} else {
				CDP({ target: tab }, (client) => {
					console.log(`New tab created: ${tab.id}`)
					client.id = tab.id // save the id for a later call to CDP.Close()
					resolve(client)
				}).on('error', (err) => {
					console.log(`cannot connect to chrome tab: ${err}`)
					process.exit(1)
				})
			}
		})
	})
}

const runTab = () => {
	return new Promise(async (resolve, reject) => {
		const c = await newTab()
		await c.Page.enable()
		await c.Page.navigate({
			url: 'https://www.tradesy.com/i/hermes-brown-border-silk-twill-90-cm-scarfwrap/22902226/'
		})
		c.Page.loadEventFired(() => {
			c.close()
			CDP.Close({id: c.id})
			resolve()
		})
	})
}

const runTest = () => {
	const fakeArray = new Array(1000)
	return Promise.each(fakeArray, () => {
		return Promise.all([runTab(), runTab(), runTab()])
	})
}
