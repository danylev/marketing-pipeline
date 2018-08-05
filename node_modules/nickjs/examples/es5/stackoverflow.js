"use strict";var _regenerator = require("babel-runtime/regenerator");var _regenerator2 = _interopRequireDefault(_regenerator);var _stringify = require("babel-runtime/core-js/json/stringify");var _stringify2 = _interopRequireDefault(_stringify);var _getIterator2 = require("babel-runtime/core-js/get-iterator");var _getIterator3 = _interopRequireDefault(_getIterator2);var _from = require("babel-runtime/core-js/array/from");var _from2 = _interopRequireDefault(_from);var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var Nick = require("../../lib/Nick");
var nick = new Nick({
	headless: true,
	debug: true });


(0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {var tab, _ref2, status, statusText, newUrl, top10questionLinks, pos, _iterator2, _isArray2, _i2, _ref4, link;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (

						nick.newTab());case 2:tab = _context.sent;_context.next = 5;return (

						tab.open("stackoverflow.com"));case 5:_ref2 = _context.sent;status = _ref2[0];statusText = _ref2[1];newUrl = _ref2[2];
					console.log("OPEN RET: " + status + ", " + statusText + ", " + newUrl);_context.next = 12;return (
						tab.untilVisible(".question-summary.narrow"));case 12:_context.next = 14;return (
						tab.evaluate(function (arg, callback) {
							var ret = [];
							for (var _iterator = (0, _from2.default)(document.querySelectorAll("a.question-hyperlink")).slice(0, 10), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {var _ref3;if (_isArray) {if (_i >= _iterator.length) break;_ref3 = _iterator[_i++];} else {_i = _iterator.next();if (_i.done) break;_ref3 = _i.value;}var link = _ref3;
								ret.push(link.href);
							}
							callback(null, ret);
						}));case 14:top10questionLinks = _context.sent;

					console.log((0, _stringify2.default)(top10questionLinks, undefined, 8));

					pos = 1;_iterator2 =
					top10questionLinks, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator3.default)(_iterator2);case 18:if (!_isArray2) {_context.next = 24;break;}if (!(_i2 >= _iterator2.length)) {_context.next = 21;break;}return _context.abrupt("break", 43);case 21:_ref4 = _iterator2[_i2++];_context.next = 28;break;case 24:_i2 = _iterator2.next();if (!_i2.done) {_context.next = 27;break;}return _context.abrupt("break", 43);case 27:_ref4 = _i2.value;case 28:link = _ref4;_context.next = 31;return (
						tab.open(link));case 31:_context.next = 33;return (
						tab.untilVisible(".postcell .post-text"));case 33:_context.next = 35;return (
						tab.wait(3000));case 35:
					console.log("Taking screenshot");_context.next = 38;return (
						tab.screenshot("stackoverflow" + pos + ".jpg", { quality: 40 }));case 38:_context.next = 40;return (
						tab.wait(3000));case 40:
					++pos;case 41:_context.next = 18;break;case 43:


					nick.exit();case 44:case "end":return _context.stop();}}}, _callee, undefined);}))().


catch(function (err) {
	console.log("Oops, something went wrong: " + err);
	nick.exit(1);
});