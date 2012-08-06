var testHelper = require("./../cf-testing")
  , assert = require("assert")
  , moduleTester = new (testHelper.Tester)
  , testFileName = __dirname + "/../../lib/mongodb";

testHelper.testsName("MongoDB");

testHelper.setBasicEnv();

var mongoService = "{\"mongodb-1.8\":[{\"name\":\"mongodb-1\",\"label\":\"mongodb-1.8\",\"plan\":\"free\",\"tags\":[\"mongodb\",\"mongodb-1.6\",\"nosql\"],\"credentials\":{\"hostname\":\"mock-server\",\"host\":\"mock-server\",\"port\":1000,\"username\":\"e808e1b7\",\"password\":\"db0c339e\",\"name\":\"e808e1b7\",\"db\":\"e808e1b7\"}}]}";

testHelper.setCloudServices(mongoService);
var testedModule = require(testFileName).createNew();

testHelper.test("No skipping", function () {
  var output = testHelper.catchOutput(function () {
    testedModule.setup();
  });
  assert.equal(output, "");
  moduleTester.passed++;
});

var mongodb = require("mongodb");

testHelper.test("required mongodb.Db.connect() redefined", function () {
  var expected = "function () {var args = sc.redefineProps(arguments, [props.url]);return oldConnect.apply(this, args);}";
  var actual = mongodb.Db.connect.toString();

  assert.equal(testHelper.comparePart(actual), testHelper.comparePart(expected));

  moduleTester.passed++;
});

var Server = mongodb.Server;
var serverConfig = new Server("", 0);
var Db = mongodb.Db;
var dbConfig = new Db("db", serverConfig);

testHelper.test("required mongodb new Server() redefined", function () {
  var expected = "function () {var args = sc.redefineProps(arguments, [props.host, parseInt(props.port, 10)]);return oldServer.apply(this, args);}";
  var actual = mongodb.Server.toString();

  assert.equal(testHelper.comparePart(actual), testHelper.comparePart(expected));

  assert.equal(serverConfig.host, "mock-server");
  assert.equal(serverConfig.port, "1000");

  moduleTester.passed++;
});

testHelper.test("required mongodb new Db() redefined", function () {
  var expected = "function () {var args = sc.redefineProps(arguments, [props.db]);return oldDb.apply(this, args);}";
  var actual = mongodb.Db.toString();

  assert.equal(testHelper.comparePart(actual), testHelper.comparePart(expected));
  assert.equal(dbConfig.databaseName, "e808e1b7");

  moduleTester.passed++;
});

var mongoose = require("mongoose");

testHelper.test("required mongoose.Connection.open() redefined", function () {
  var expected = "function () {var args = [];args.push(props.url);var originalOptions = null;var callback = null;// Arguments can be in different length, url, options, callbackif (typeof";
  var Connection = mongoose.Connection;
  var actual = Connection.prototype.open.toString();
  assert.equal(testHelper.comparePart(actual), testHelper.comparePart(expected));
  moduleTester.passed++;
});
