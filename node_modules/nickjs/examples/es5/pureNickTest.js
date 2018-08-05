'use strict';var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var Promise = require('bluebird');
var Nick = require("../../lib/Nick");
var nick = new Nick({
    headless: true,
    timeout: 30000,
    debug: true });


var runTab = function () {var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {var tab;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (
                            nick.newTab());case 2:tab = _context.sent;_context.next = 5;return (
                            tab.open('https://www.tradesy.com/i/hermes-brown-border-silk-twill-90-cm-scarfwrap/22902226/'));case 5:_context.next = 7;return (











                            tab.close());case 7:case 'end':return _context.stop();}}}, _callee, undefined);}));return function runTab() {return _ref.apply(this, arguments);};}();


var runTestTabs = function runTestTabs() {
    var fakeArray = new Array(1000);

    return Promise.each(fakeArray, function () {
        return Promise.all([runTab(), runTab(), runTab()]);
    });
};

(0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (
                        runTestTabs());case 2:
                    console.log("Test complete!");
                    nick.exit();case 4:case 'end':return _context2.stop();}}}, _callee2, undefined);}))();