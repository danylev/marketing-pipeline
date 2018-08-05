"use strict";var _keys = require("babel-runtime/core-js/object/keys");var _keys2 = _interopRequireDefault(_keys);var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require("babel-runtime/helpers/createClass");var _createClass3 = _interopRequireDefault(_createClass2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}



var TabDriver = require("./TabDriver");

var CDP = require('chrome-remote-interface');
var _ = require("lodash");
var toBoolean = require("to-boolean");var

BrowserDriver = function () {

	function BrowserDriver(nick) {(0, _classCallCheck3.default)(this, BrowserDriver);
		this._nick = nick;
		this._options = nick.options;
	}(0, _createClass3.default)(BrowserDriver, [{ key: "exit", value: function exit(

		code) {
			process.exit(code);
		} }, { key: "_initialize", value: function _initialize(

		callback) {var _this = this;
			var chromePath = process.env.CHROME_PATH || "google-chrome-beta";
			var childOptions = [
			"--remote-debugging-port=9222",

			"--disable-web-security",
			"--allow-insecure-localhost",
			"--allow-running-insecure-content",
			"--allow-file-access-from-files", "--window-size=" +

			this._options.width + "," + this._options.height,

			"--disable-background-networking",
			"--disable-background-timer-throttling",
			"--disable-client-side-phishing-detection",
			"--disable-default-apps",
			"--disable-extensions",
			"--disable-hang-monitor",
			"--disable-popup-blocking",
			"--disable-prompt-on-repost",
			"--disable-sync",
			"--disable-translate",
			"--metrics-recording-only",
			"--no-first-run",
			"--safebrowsing-disable-auto-update",
			"--password-store=basic",
			"--use-mock-keychain"];





			if (this._options.headless) {
				childOptions.push("--disable-gpu");
				childOptions.push("--headless");
				childOptions.push("--hide-scrollbars");
				childOptions.push("--mute-audio");
			} else {
				childOptions.push("--enable-automation");
			}


			if (this._options.httpProxy) {var _require =
				require("url"),URL = _require.URL;
				var url = new URL(this._options.httpProxy);

				this._options._proxyUsername = url.username;
				this._options._proxyPassword = url.password;
				childOptions.push("--proxy-server=" + url.host);
			}


			if (toBoolean(process.env.NICKJS_NO_SANDBOX || false)) {
				childOptions.push("--no-sandbox");
				childOptions.push("--disable-setuid-sandbox");
			}

			var child = require("child_process").spawn(chromePath, childOptions);
			process.on("exit", function () {
				if (!child.killed) {
					try {
						child.kill();
					} catch (e) {}
				}
			});
			child.on("error", function (err) {
				callback("could not start chrome: " + err);
			});
			if (this._options.debug) {
				child.stdout.on("data", function (d) {
					process.stdout.write("CHROME STDOUT: " + d.toString());
				});
				child.stderr.on("data", function (d) {
					process.stdout.write("CHROME STDERR: " + d.toString());
				});
				var pidusage = require("pidusage");
				var logChromeMemory = function logChromeMemory() {
					pidusage.stat(child.pid, function (err, stat) {
						if (!err && stat.cpu && stat.memory) {
							console.log("> Chrome: CPU " + Math.round(stat.cpu) + "%, memory " + Math.round(stat.memory / (1000 * 1000)) + "M");
						}
					});
				};
				setInterval(logChromeMemory, 60 * 1000);
			} else {

				child.stdout.on("data", function (d) {});
				child.stderr.on("data", function (d) {});
			}
			child.on("exit", function (code, signal) {
				if (signal) {
					process.stdout.write("\nFatal: Chrome subprocess killed by signal " + signal + "\n\n");
				} else {
					process.stdout.write("\nFatal: Chrome subprocess exited with code " + code + "\n\n");
				}
				for (var tabId in _this._nick.tabs) {
					_this._nick.tabs[tabId].driver._chromeHasCrashed();
				}
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
							callback("could not connect to chrome debugger after " + nbChecks + " tries (10s): " + err);
						} else {
							checkDebuggerPort();
						}
					});
					socket.once("connect", function () {
						if (_this._options.debug) {
							console.log("> It took " + (Date.now() - checkStart) + "ms to start and connect to Chrome (" + (nbChecks + 1) + " tries)");
						}
						cleanSocket(socket);
						callback(null);
					});
				}, Math.min(100 + nbChecks * 50, 500));
			};
			checkDebuggerPort();
		} }, { key: "_newTabDriver", value: function _newTabDriver(

		uniqueTabId, callback) {var _this2 = this;
			var connectToTab = function connectToTab(cdpTarget) {
				CDP({ target: cdpTarget }, function (client) {
					var tab = new TabDriver(uniqueTabId, _this2._options, client, cdpTarget.id);
					tab._init(function (err) {
						if (err) {
							callback(err);
						} else {
							callback(null, tab);
						}
					});
				}).on('error', function (err) {
					callback("cannot connect to chrome tab: " + err);
				});
			};
			CDP.List(function (err, tabs) {
				if (err) {
					callback("could not list chrome tabs: " + err);
				} else {
					if (uniqueTabId === 1 && tabs.length === 1 && tabs[0].url === "about:blank") {

						connectToTab(tabs[0]);
					} else {
						CDP.New(function (err, tab) {
							if (err) {
								callback("cannot create new chrome tab: " + err);
							} else {

								connectToTab(tab);
							}
						});
					}
				}
			});
		} }, { key: "__getOneTabForCookieRequest", value: function __getOneTabForCookieRequest(





		methodName, callback) {
			var tab = this._nick.tabs[(0, _keys2.default)(this._nick.tabs)[0]];
			if (tab) {
				return tab;
			} else {
				callback(methodName + ": could not manipulate cookies because there are no open tabs, please open at least one tab");
				return null;
			}
		} }, { key: "_getAllCookies", value: function _getAllCookies(

		callback) {
			var tab = this.__getOneTabForCookieRequest("getAllCookies", callback);
			if (tab) {
				tab.driver._getAllCookies(callback);
			}
		} }, { key: "_deleteAllCookies", value: function _deleteAllCookies(

		callback) {
			var tab = this.__getOneTabForCookieRequest("deleteAllCookies", callback);
			if (tab) {
				tab.driver._deleteAllCookies(callback);
			}
		} }, { key: "_deleteCookie", value: function _deleteCookie(

		name, domain, callback) {
			var tab = this.__getOneTabForCookieRequest("deleteCookie", callback);
			if (tab) {
				tab.driver._deleteCookie(name, domain, callback);
			}
		} }, { key: "_setCookie", value: function _setCookie(

		cookie, callback) {
			var tab = this.__getOneTabForCookieRequest("setCookie", callback);
			if (tab) {
				tab.driver._setCookie(cookie, callback);
			}
		} }]);return BrowserDriver;}();



module.exports = BrowserDriver;