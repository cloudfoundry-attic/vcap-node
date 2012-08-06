var testHelper = require("./../cf-testing")
  , assert = require("assert")
  , moduleTester = new (testHelper.Tester);

testHelper.testsName("Rabbitmq");

var serviceConf = testHelper.serviceConf("rabbitmq");
var vcapServices = {
  "rabbitmq-2.4" : [{
    "name" : "rabbitmq-test-service",
    "label" : "rabbitmq-2.4",
    "credentials": serviceConf
  }]
};

testHelper.setBasicEnv();
testHelper.setCloudServices(JSON.stringify(vcapServices));

var host = "rabbitmq-url" + testHelper.randomName();
var username = "username_" + testHelper.randomName();
var password = "password_" + testHelper.randomName();

require(__dirname + "/../../lib/index.js");

var amqp = require("amqp");

testHelper.test("amqp.new Connection()", function () {
  var Connection = amqp.Connection;
  var testCon = new Connection({}, {}, function () {});
  testAMQPConnection(testCon);
});

testHelper.test("amqp.createConnection()", function () {
  var testCon = amqp.createConnection({}, {});
  testAMQPConnection(testCon);
});

function testAMQPConnection (testCon) {
  testCon.on("error", function (e) {
    assert(false, "amqp connection error: " + e);
  });

  assert.equal(testCon.options.vhost, serviceConf.vhost);
  assert.equal(testCon.options.login, serviceConf.username);
  assert.equal(testCon.options.host, serviceConf.host);
  assert.equal(testCon.options.password, serviceConf.password);
  assert.equal(testCon.options.port, serviceConf.port);

  testCon.on("ready", function () {
    testCon.end();
    moduleTester.passed++;
  });
}
