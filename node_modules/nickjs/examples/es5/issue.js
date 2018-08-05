"use strict";var _regenerator = require("babel-runtime/regenerator");var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var CDP = require("chrome-remote-interface");
var Promise = require("bluebird");

var chromeFlags = [
'--remote-debugging-port=9222',
"--enable-logging",
"--v=1",
"--headless"];


var child = require("child_process").spawn("google-chrome-beta", chromeFlags, {
	stdio: 'pipe' });

child.stdout.on('data', function () {});
child.stderr.on('data', function () {});
process.on("exit", function () {child.kill();});
setTimeout(function () {runTest();}, 1000); // give time for Chrome to start

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