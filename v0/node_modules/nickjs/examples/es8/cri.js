const CDP = require("chrome-remote-interface")
const Promise = require("bluebird");

const chromeFlags = [
	"--no-sandbox",
	"--enable-logging",
	"--v=1",

	// set window size
	`--window-size=1280,800`,

	// flags taken from Puppeteer's defaultArgs
	"--disable-background-timer-throttling",
	"--disable-client-side-phishing-detection",
	"--disable-hang-monitor",
	"--disable-popup-blocking",
	"--disable-prompt-on-repost",
	"--password-store=basic",
	"--use-mock-keychain",

	// headless mode
	"--disable-gpu",
	"--headless",
	"--hide-scrollbars",
]

const startManually = (callback) => {
	let childOptions = [
		'--disable-translate',
		'--disable-extensions',
		'--disable-background-networking',
		'--safebrowsing-disable-auto-update',
		'--disable-sync',
		'--metrics-recording-only',
		'--disable-default-apps',
		'--mute-audio',
		'--no-first-run',
		'--remote-debugging-port=9222',
		'--disable-setuid-sandbox',
	]
	childOptions = childOptions.concat(chromeFlags)
	childOptions.push('about:blank')

	const child = require("child_process").execFile("google-chrome-beta", childOptions)
	//const child = require("child_process").spawn("google-chrome-beta", childOptions, {
	//	//stdio: 'ignore',
	//})
	//console.log(child.spawnargs)
	child.stdout.on('data', () => { });
	child.stderr.on('data', () => { });
	child.stderr.on('exit', (code, signal) => { console.log(`Chrome exit: ${code}, ${signal}`) });
	process.on("exit", () => {
		child.kill()
	})
	const cleanSocket = (socket) => {
		socket.removeAllListeners()
		socket.end()
		socket.destroy()
		socket.unref()
	}
	const net = require("net")
	const checkStart = Date.now()
	let nbChecks = 0
	const checkDebuggerPort = () => {
		setTimeout(() => {
			const socket = net.createConnection(9222)
			socket.once("error", (err) => {
				++nbChecks
				cleanSocket(socket)
				if ((Date.now() - checkStart) > (10 * 1000)) {
					console.log(`could not connect to chrome debugger after ${nbChecks} tries (10s): ${err}`)
				} else {
					checkDebuggerPort()
				}
			})
			socket.once("connect", () => {
				console.log(`> It took ${Date.now() - checkStart}ms to start and connect to Chrome (${nbChecks + 1} tries)`)
				cleanSocket(socket)
				runTest()
			})
		}, Math.min(100 + nbChecks * 50, 500))
	}
	checkDebuggerPort()
}

const startWithLauncher = (callback) => {
	require("chrome-launcher").launch({
		port: 9222,
		chromePath: "google-chrome-beta",
		chromeFlags,
		userDataDir: false,
		logLevel: 'verbose',
		envVars: process.env,
	}).then((chrome) => {
		console.log(chrome.process.spawnargs)
		chrome.process.on("error", (err) => {
			console.log(`could not start chrome: ${err}`)
		})
		chrome.process.on("exit", (code, signal) => {
			if (signal) {
				process.stdout.write(`\nFatal: Chrome subprocess killed by signal ${signal}\n\n`)
			} else {
				process.stdout.write(`\nFatal: Chrome subprocess exited with code ${code}\n\n`)
			}
		})
		callback()
	}).catch((err) => {
		console.log(err)
	})
}

const newTab = async (callback) => {
	return new Promise((resolve, reject) => {
		CDP.New((err, tab) => {
			if (err) {
				console.log(`cannot create new chrome tab: ${err}`)
				process.exit(1)
			} else {
				CDP({ target: tab }, (client) => {
					console.log("New tab created: " + tab.id)
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

if (process.argv[2] === 'manual') {
	startManually(() => {
		runTest()
	})
} else if (process.argv[2] === 'launcher') {
	startWithLauncher(() => {
		runTest()
	})
} else {
	console.log('manual or launcher?')
}
