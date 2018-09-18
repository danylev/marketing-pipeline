"use strict";var _regenerator = require("babel-runtime/regenerator");var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var Nick = require("../../lib/Nick");
var nick = new Nick({
	headless: false,
	debug: true });


var instagramConnect = function () {var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(tab, sessionCookie) {return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
						console.log("Connecting to instagram...");_context.next = 3;return (
							nick.setCookie({
								name: "sessionid",
								value: sessionCookie,
								domain: "www.instagram.com",
								secure: true,
								httpOnly: true }));case 3:_context.next = 5;return (

							tab.open("instagram.com"));case 5:_context.prev = 5;_context.next = 8;return (

							tab.waitUntilVisible("body span section main section div div div div article"));case 8:
						console.log("Connected to Instagram successfully.");_context.next = 14;break;case 11:_context.prev = 11;_context.t0 = _context["catch"](5);throw (

							"Could not connect to Instagram with that sessionCookie.");case 14:case "end":return _context.stop();}}}, _callee, undefined, [[5, 11]]);}));return function instagramConnect(_x, _x2) {return _ref.apply(this, arguments);};}();



(0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {var tab;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (

						nick.newTab());case 2:tab = _context2.sent;_context2.next = 5;return (

						instagramConnect(tab, "IGSC186521252a0112ace5cc0657de5d0d6d9a0cb9afa213efa78538a0b1d24b8549%3A0fwAAXNrJaLrMcqXEzZBAwuoRhL1jHuG%3A%7B%22_auth_user_id%22%3A1383862544%2C%22_auth_user_backend%22%3A%22accounts.backends.CaseInsensitiveModelBackend%22%2C%22_auth_user_hash%22%3A%22%22%2C%22_token_ver%22%3A2%2C%22_token%22%3A%221383862544%3A4rncsxUsN4zbBlln3spqk2quw9Ffzhhw%3A5fbedf26a0840d17a946bfb0cff08eb94d1097f10910165731e8f50f98428612%22%2C%22_platform%22%3A4%2C%22last_refreshed%22%3A1512551815.9365186691%7D"));case 5:_context2.next = 7;return (

						tab.wait(5000));case 7:_context2.next = 9;return (

						tab.open('ipinfo.io'));case 9:_context2.next = 11;return (

						tab.wait(10000));case 11:

					nick.exit();case 12:case "end":return _context2.stop();}}}, _callee2, undefined);}))().


catch(function (err) {
	console.log("Oops, something went wrong: " + err);
	nick.exit(1);
});