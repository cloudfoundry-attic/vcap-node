var testHelper = require("./../cf-testing")
  , assert = require("assert")
  , moduleTester = new (testHelper.Tester);

testHelper.testsName("Postgresql");

var serviceConf = testHelper.serviceConf("postgresql");
var vcapServices = {
  "postgresql-9.0" : [{
    "name" : "pg-test-service",
    "label" : "postgresql-9.0",
    "credentials": serviceConf
  }]
};

testHelper.setBasicEnv();
testHelper.setCloudServices(JSON.stringify(vcapServices));

var host = "pg-url" + testHelper.randomName();
var username = "username_" + testHelper.randomName();
var password = "password_" + testHelper.randomName();

require(__dirname + "/../../lib/index.js");

var pg = require("pg");

testHelper.test("pg.new Client()", function () {
  var Client = pg.Client;
  var testClient = new Client("postgres://"+username+":"+password+"@"+host);
  assert.equal(testClient.host, serviceConf.host);
  assert.equal(testClient.port, serviceConf.port);
  assert.equal(testClient.user, serviceConf.username);
  assert.equal(testClient.password, serviceConf.password);
  assert.equal(testClient.database, serviceConf.name);

  testClient.connect(function(err) {
    assert.equal(err, null);
    moduleTester.passed++;
    testClient.end();
  });
});


testHelper.test("pg.connect() with config object", function () {
  pg.connect({}, function (err, client) {
    assert.equal(err, null);
    client.end();
    moduleTester.passed++;
  });
});

testHelper.test("pg.connect() with config string", function () {
  pg.connect("", function (err, client) {
    assert.equal(err, null);
    client.end();
    moduleTester.passed++;
  });
});

testHelper.test("pg.connect() without config (use defaults)", function () {
  pg.connect(function (err, client) {
    assert.equal(err, null);
    client.end();
    moduleTester.passed++;
  });
});


