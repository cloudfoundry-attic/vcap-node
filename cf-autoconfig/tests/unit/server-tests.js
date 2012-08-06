var testHelper = require("./../cf-testing")
  , assert = require("assert")
  , moduleTester = new (testHelper.Tester)
  , testFileName = __dirname + "/../../lib/server";

testHelper.testsName("Server");
var testedModule = require(testFileName).createNew();

testedModule.setup();

testHelper.test("required http.listen() redefined", function () {
  var expected = "function () {var callArgs = Array.prototype.slice.call(arguments);var args = [];// set 1st as CF port// 2nd as host only if original function has it// pass the rest arguments as they are";
  var actual = (require("http").Server()).listen.toString();

  assert.equal(testHelper.comparePart(actual), testHelper.comparePart(expected));
  moduleTester.passed++;
});

testHelper.test("required https.listen() redefined", function () {
  var expected = "function () {var callArgs = Array.prototype.slice.call(arguments);var args = [];// set 1st as CF port// 2nd as host only if original function has it// pass the rest arguments as they are";
  var actual = (require("https").Server({})).listen.toString();

  assert.equal(testHelper.comparePart(actual), testHelper.comparePart(expected));
  moduleTester.passed++;
});
