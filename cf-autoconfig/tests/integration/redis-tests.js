var testHelper = require("./../cf-testing")
  , assert = require("assert")
  , moduleTester = new (testHelper.Tester);

testHelper.testsName("Redis");

var serviceConf = testHelper.serviceConf("redis");
var vcapServices = {
  "redis-2.2" : [{
    "name" : "redis-test-service",
    "label" : "redis-2.2",
    "credentials": serviceConf
  }]
};

testHelper.setBasicEnv();
testHelper.setCloudServices(JSON.stringify(vcapServices));

var randomHost = "original-host-" + testHelper.randomName();
var randomPassword = "password_" + testHelper.randomName();

require(__dirname + "/../../lib/index.js");

var redis = require("redis");

var client = redis.createClient(0, randomHost);

testHelper.test("redis.createClient()", function () {

  client.on("error", function (err) {
    assert.fail(err, null, "Expected no error, got: " + err.message);
  });

  assert.equal(client.host, serviceConf.host);
  assert.equal(client.port, serviceConf.port);
  assert.equal(client.auth_pass, serviceConf.password);

  moduleTester.passed++;
});

testHelper.test("redis.auth()", function () {
  client.auth(randomPassword);

  assert.equal(client.auth_pass, serviceConf.password);
  client.end();
  moduleTester.passed++;
});