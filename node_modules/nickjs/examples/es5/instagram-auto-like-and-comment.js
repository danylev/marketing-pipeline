"use strict"; // Phantombuster configuration {
"phantombuster command: nodejs";
"phantombuster package: 4";
"phantombuster dependencies: lib-StoreUtilities.js";
"phantombuster flags: save-folder";var _getIterator2 = require("babel-runtime/core-js/get-iterator");var _getIterator3 = _interopRequireDefault(_getIterator2);var _regenerator = require("babel-runtime/regenerator");var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var Buster = require("phantombuster");
var buster = new Buster();

var Nick = require("nickjs");
var nick = new Nick({
	loadImages: true,
	userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36" });







var StoreUtilities = require("./lib-StoreUtilities");
var utils = new StoreUtilities(nick, buster);
// }

var instagramConnect = function () {var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(tab, sessionCookie) {return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
						utils.log("Connecting to instagram...", "loading");_context.next = 3;return (
							nick.setCookie({
								name: "sessionid",
								value: sessionCookie,
								domain: "www.instagram.com",
								secure: true,
								httpOnly: true }));case 3:_context.next = 5;return (

							tab.open("instagram.com"));case 5:_context.prev = 5;_context.next = 8;return (

							tab.waitUntilVisible("#mainFeed"));case 8:
						utils.log("Connected to Instagram successfully.", "done");_context.next = 14;break;case 11:_context.prev = 11;_context.t0 = _context["catch"](5);throw (

							"Could not connect to Instagram with that sessionCookie.");case 14:case "end":return _context.stop();}}}, _callee, undefined, [[5, 11]]);}));return function instagramConnect(_x, _x2) {return _ref.apply(this, arguments);};}();



var getRecentsDivNb = function getRecentsDivNb(arg, callback) {
	callback(null, document.querySelectorAll("article._jzhdd > div:not(._21z45) > div._cmdpi > div._70iju > ._mck9w").length);
};

var loadPosts = function () {var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(tab, n) {var length;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (
							tab.evaluate(getRecentsDivNb));case 2:length = _context2.sent;case 3:if (!(
						length < n)) {_context2.next = 20;break;}
						utils.log("Loaded " + length + " posts.", "info");_context2.next = 7;return (
							tab.scrollToBottom());case 7:_context2.next = 9;return (
							tab.wait(2000));case 9:_context2.t0 =
						length;_context2.next = 12;return tab.evaluate(getRecentsDivNb);case 12:_context2.t1 = _context2.sent;if (!(_context2.t0 === _context2.t1)) {_context2.next = 15;break;}return _context2.abrupt("break", 20);case 15:_context2.next = 17;return (


							tab.evaluate(getRecentsDivNb));case 17:length = _context2.sent;_context2.next = 3;break;case 20:

						utils.log("Loaded " + length + " posts.", "done");case 21:case "end":return _context2.stop();}}}, _callee2, undefined);}));return function loadPosts(_x3, _x4) {return _ref2.apply(this, arguments);};}();


var setClasses = function setClasses(arg, callback) {
	var recent = document.querySelectorAll("article._jzhdd > div:not(._21z45) > div._cmdpi > div._70iju > ._mck9w");
	var i = 0;
	for (var _iterator = recent, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {var _ref3;if (_isArray) {if (_i >= _iterator.length) break;_ref3 = _iterator[_i++];} else {_i = _iterator.next();if (_i.done) break;_ref3 = _i.value;}var div = _ref3;
		if (i < arg.n) {
			div.classList.add("phclass" + i);
			i++;
		} else {
			break;
		}
	}
	callback();
};

var likePosts = function () {var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(tab, max, message) {var i;return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
						i = 0;case 1:if (!(i < max)) {_context3.next = 28;break;}_context3.prev = 2;_context3.next = 5;return (

							tab.click(".phclass" + i + " a"));case 5:
						utils.log("Liking post " + (i + 1), "loading");_context3.next = 8;return (
							tab.wait(2000));case 8:_context3.next = 10;return (
							tab.click("._eszkz"));case 10:_context3.next = 12;return (
							tab.sendKeys("textarea._bilrf", message));case 12:_context3.next = 14;return (
							tab.wait(2000));case 14:_context3.next = 16;return (
							tab.screenshot("screen" + i + ".jpg"));case 16:_context3.next = 18;return (
							tab.click("button._dcj9f"));case 18:
						utils.log("Post " + (i + 1) + " liked.", "done");_context3.next = 25;break;case 21:_context3.prev = 21;_context3.t0 = _context3["catch"](2);

						console.log(_context3.t0);return _context3.abrupt("break", 28);case 25:i++;_context3.next = 1;break;case 28:case "end":return _context3.stop();}}}, _callee3, undefined, [[2, 21]]);}));return function likePosts(_x5, _x6, _x7) {return _ref4.apply(this, arguments);};}();





(0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {var tab, _utils$checkArguments, sessionCookie, tag, limit, message, result;return _regenerator2.default.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:_context4.next = 2;return (
						nick.newTab());case 2:tab = _context4.sent;_utils$checkArguments =
					utils.checkArguments([
					{ name: "sessionCookie", type: "string", length: 20 },
					{ name: "tag", type: "string", length: 1 },
					{ name: "limit", type: "number", default: 5 },
					{ name: "message", type: "string", default: "" }]), sessionCookie = _utils$checkArguments[0], tag = _utils$checkArguments[1], limit = _utils$checkArguments[2], message = _utils$checkArguments[3];_context4.next = 6;return (

						instagramConnect(tab, sessionCookie));case 6:
					console.log(1);_context4.next = 9;return (
						tab.open("https://www.facebook.com/"));case 9:
					// await tab.open(`https://www.instagram.com/explore/tags/${tag}/`)
					console.log(2);_context4.next = 12;return (
						tab.waitUntilVisible("img._2di5p"));case 12:
					console.log(3);_context4.next = 15;return (
						loadPosts(tab, limit));case 15:
					console.log(4);_context4.next = 18;return (
						tab.evaluate(setClasses, { n: limit }));case 18:_context4.next = 20;return (
						likePosts(tab, limit, message));case 20:result = _context4.sent;
					nick.exit();case 22:case "end":return _context4.stop();}}}, _callee4, undefined);}))().

catch(function (err) {
	utils.log(err, "error");
	nick.exit(1);
});