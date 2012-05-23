var testHelper = require("./../cf-testing")
  , assert = require("assert")
  , moduleTester = new (testHelper.Tester)
  , testFileName = __dirname + "/../../lib/rabbitmq";

testHelper.testsName("Rabbitmq");

testHelper.setBasicEnv();

var amqpService = "{\"rabbitmq-2.4\":[{\"name\":\"rabbitmq-d90e\",\"label\":\"rabbitmq-2.4\",\"plan\":\"free\",\"tags\":[\"rabbitmq\",\"rabbitmq-2.4\",\"message-queue\",\"amqp\"],\"credentials\":{\"name\":\"dc8fd76d-f698-44d3-a1b3-7221f41ea6ce\",\"hostname\":\"172.0.0.2\",\"host\":\"172.0.0.2\",\"port\":10015,\"vhost\":\"v14984182b9a047a6986d98116f961513\",\"username\":\"u7dQI5EM8EKKq\",\"user\":\"u7dQI5EM8EKKq\",\"password\":\"pTZoXfIzOpuno\",\"pass\":\"pTZoXfIzOpuno\",\"url\":\"amqp://u7dQI5EM8EKKq:pTZoXfIzOpuno@172.0.0.2:10015/v14984182b9a047a6986d98116f961513\"}}]}";

testHelper.setCloudServices(amqpService);
var testedModule = require(testFileName).createNew();

testHelper.test("No skipping", function () {
  var output = testHelper.catchOutput(function () { testedModule.setup(); });
  assert.equal(output, "");
  moduleTester.passed++;
});

var amqp = require("amqp");

testHelper.test("required amqp.createConnection redefined", function () {
  var expected = "function () {var args = sc.redefineProps(arguments, [config]);return oldCreateConnection.apply(this, args);}";
  var actual = amqp.createConnection.toString();

  assert.equal(testHelper.comparePart(actual), testHelper.comparePart(expected));
  moduleTester.passed++;
});

testHelper.test("required amqp.new Connection() redefined", function () {
  var Connection = amqp.Connection;
  var testCon = new Connection({}, {});
  assert.equal(testCon.options.vhost, "v14984182b9a047a6986d98116f961513");
  assert.equal(testCon.options.login, "u7dQI5EM8EKKq");
  assert.equal(testCon.options.host, "172.0.0.2");
  assert.equal(testCon.options.password, "pTZoXfIzOpuno");
  assert.equal(testCon.options.port, "10015");
  moduleTester.passed++;
});
