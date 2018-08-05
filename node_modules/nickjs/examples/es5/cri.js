"use strict";var _regenerator = require("babel-runtime/regenerator");var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var CDP = require("chrome-remote-interface");
var Promise = require("bluebird");

var chromeFlags = [
"--no-sandbox",
"--enable-logging",
"--v=1",

// set window size
"--window-size=1280,800",

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
"--hide-scrollbars"];


var startManually = function startManually(callback) {
	var childOptions = [
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
	'--disable-setuid-sandbox'];

	childOptions = childOptions.concat(chromeFlags);
	childOptions.push('about:blank');

	var child = require("child_process").execFile("google-chrome-beta", childOptions);
	//const child = require("child_process").spawn("google-chrome-beta", childOptions, {
	//	//stdio: 'ignore',
	//})
	//console.log(child.spawnargs)
	child.stdout.on('data', function () {});
	child.stderr.on('data', function () {});
	child.stderr.on('exit', function (code, signal) {console.log("Chrome exit: " + code + ", " + signal);});
	process.on("exit", function () {
		child.kill();
	});
	var cleanSocket = function cleanSocket(socket) {
		socket.removeAllListeners();
		socket.end();
		socket.destroy();
		socket.unref();
	};
	var net = require("net");
	var checkStart = Date.now();
	var nbChecks = 0;
	var checkDebuggerPort = function checkDebuggerPort() {
		setTimeout(function () {
			var socket = net.createConnection(9222);
			socket.once("error", function (err) {
				++nbChecks;
				cleanSocket(socket);
				if (Date.now() - checkStart > 10 * 1000) {
					console.log("could not connect to chrome debugger after " + nbChecks + " tries (10s): " + err);
				} else {
					checkDebuggerPort();
				}
			});
			socket.once("connect", function () {
				console.log("> It took " + (Date.now() - checkStart) + "ms to start and connect to Chrome (" + (nbChecks + 1) + " tries)");
				cleanSocket(socket);
				runTest();
			});
		}, Math.min(100 + nbChecks * 50, 500));
	};
	checkDebuggerPort();
};

var startWithLauncher = function startWithLauncher(callback) {
	require("chrome-launcher").launch({
		port: 9222,
		chromePath: "google-chrome-beta",
		chromeFlags: chromeFlags,
		userDataDir: false,
		logLevel: 'verbose',
		envVars: process.env }).
	then(function (chrome) {
		console.log(chrome.process.spawnargs);
		chrome.process.on("error", function (err) {
			console.log("could not start chrome: " + err);
		});
		chrome.process.on("exit", function (code, signal) {
			if (signal) {
				process.stdout.write("\nFatal: Chrome subprocess killed by signal " + signal + "\n\n");
			} else {
				process.stdout.write("\nFatal: Chrome subprocess exited with code " + code + "\n\n");
			}
		});
		callback();
	}).catch(function (err) {
		console.log(err);
	});
};

var newTab = function () {var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(callback) {return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:return _context.abrupt("return",
						new Promise(function (resolve, reject) {
							CDP.New(function (err, tab) {
								if (err) {
									console.log("cannot create new chrome tab: " + err);
									process.exit(1);
								} else {
									CDP({ target: tab }, function (client) {
										console.log("New tab created: " + tab.id);
										client.id = tab.id; // save the id for a later call to CDP.Close()
										resolve(client);
									}).on('error', function (err) {
										console.log("cannot connect to chrome tab: " + err);
										process.exit(1);
									});
								}
							});
						}));case 1:case "end":return _context.stop();}}}, _callee, undefined);}));return function newTab(_x) {return _ref.apply(this, arguments);};}();


var runTab = function runTab() {
	return new Promise(function () {var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {var c;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (
								newTab());case 2:c = _context2.sent;_context2.next = 5;return (
								c.Page.enable());case 5:_context2.next = 7;return (
								c.Page.navigate({
									url: 'https://www.tradesy.com/i/hermes-brown-border-silk-twill-90-cm-scarfwrap/22902226/' }));case 7:

							c.Page.loadEventFired(function () {
								c.close();
								CDP.Close({ id: c.id });
								resolve();
							});case 8:case "end":return _context2.stop();}}}, _callee2, undefined);}));return function (_x2, _x3) {return _ref2.apply(this, arguments);};}());

};

var runTest = function runTest() {
	var fakeArray = new Array(1000);
	return Promise.each(fakeArray, function () {
		return Promise.all([runTab(), runTab(), runTab()]);
	});
};

if (process.argv[2] === 'manual') {
	startManually(function () {
		runTest();
	});
} else if (process.argv[2] === 'launcher') {
	startWithLauncher(function () {
		runTest();
	});
} else {
	console.log('manual or launcher?');
}