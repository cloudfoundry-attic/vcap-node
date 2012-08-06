var testHelper = require("./../cf-testing")
  , assert = require("assert")
  , moduleTester = new (testHelper.Tester);

testHelper.testsName("MongoDB");

var serviceConf = testHelper.serviceConf("mongodb");
var vcapServices = {
  "mongodb-1.8" : [{
    "name" : "mongodb-test-service",
    "label" : "mongodb-1.8",
    "credentials": serviceConf
  }]
};

testHelper.setBasicEnv();
testHelper.setCloudServices(JSON.stringify(vcapServices));

var host = "mongodb://host_" + testHelper.randomName();
var username = "username_" + testHelper.randomName();
var password = "password_" + testHelper.randomName();

require(__dirname + "/../../lib/index.js");

var mongodb = require("mongodb");

testHelper.test("mongodb.Db.connect()", function () {
  mongodb.Db.connect(host + ":0", function (err, db) {
    assert.equal(err, null);
    assert.equal(db.databaseName, serviceConf.db);
    assert.equal(db.serverConfig.host, serviceConf.host);
    assert.equal(db.serverConfig.port, serviceConf.port);
    db.close();
    moduleTester.passed++;
  });
});

testHelper.test("mongodb.connect()", function () {
  mongodb.connect(host + ":0", function (err, db) {
    assert.equal(err, null);
    assert.equal(db.databaseName, serviceConf.db);
    assert.equal(db.serverConfig.host, serviceConf.host);
    assert.equal(db.serverConfig.port, serviceConf.port);
    db.close();
    moduleTester.passed++;
  });
});

testHelper.test("mongodb new Server(), new Db, authenticate", function () {
  var Server = mongodb.Server;
  var Db = mongodb.Db;

  var db = new Db("whatever_db_name", new Server(host, 0));

  db.open(function(err, db) {
    assert.equal(err, null);
    assert.equal(db.databaseName, serviceConf.db);
    assert.equal(db.serverConfig.host, serviceConf.host);

    db.authenticate(username, password, function(err, result) {
      assert.equal(err, null);
      assert.equal(result, true);
      db.close();
      moduleTester.passed++;
    });
  });
});

var mongoose = require("mongoose");

testHelper.test("mongoose.connect()", function () {
  mongoose.connect(host);
  mongoose.connection.on("error", function (err) {
    assert.equal(err, null);
  });
  mongoose.connection.on("open", function () {
    testMongoose(mongoose.connection, serviceConf);
    mongoose.disconnect();
    moduleTester.passed++;
  });
});

testHelper.test("mongoose.createConnection()", function () {
  var conn = mongoose.createConnection(host);
  testMongoose(conn, serviceConf);
  mongoose.disconnect();
  moduleTester.passed++;
});

var Connection = mongoose.Connection;
var conn = new Connection();
conn.on("error", function (err) {
  assert.equal(err, null);
});

testHelper.test("mongoose.new Connection(url, function)", function () {
  conn.open(host, function () {
    testMongoose(conn, serviceConf);
    conn.close();
    moduleTester.passed++;
  });
});

testHelper.test("mongoose.new Connection(url, options, function)", function () {
  conn.open(host, {}, function () {
    testMongoose(conn, serviceConf);
    conn.close();
    moduleTester.passed++;
  });
});

testHelper.test("mongoose.new Connection(host, database, options, function)", function () {
  conn.open(host, "db" + testHelper.randomName(), {}, function () {
    testMongoose(conn, serviceConf);
    conn.close();
    moduleTester.passed++;
  });
});

testHelper.test("mongoose.new Connection(host, database, port, options, function)", function () {
  conn.open(host, "db" + testHelper.randomName(), 0, {}, function () {
    testMongoose(conn, serviceConf);
    conn.close();
    moduleTester.passed++;
  });
});

function testMongoose (conn, serviceConf) {
  assert.equal(conn.name, serviceConf.db);
  assert.equal(conn.user, serviceConf.username);
  assert.equal(conn.pass, serviceConf.password);
  assert.equal(conn.host, serviceConf.host);
  assert.equal(conn.port, serviceConf.port);
}