var testHelper = require("./../cf-testing")
  , assert = require("assert")
  , moduleTester = new (testHelper.Tester)
  , testFileName = __dirname + "/../../lib/redis";

testHelper.testsName("Redis");

testHelper.setBasicEnv();

var redisService = "{\"redis-2.2\":[{\"name\":\"redis-c53d8\",\"label\":\"redis-2.2\",\"plan\":\"free\",\"tags\":[\"redis\",\"redis-2.2\",\"key-value\",\"nosql\"],\"credentials\":{\"hostname\":\"172.0.0.2\",\"host\":\"172.0.0.2\",\"port\":5116,\"password\":\"dc62e534\",\"name\":\"efe7eea2\"}}]}";

testHelper.setCloudServices(redisService);
var testedModule = require(testFileName).createNew();

testHelper.test("No skipping", function () {
  var output = testHelper.catchOutput(function () { testedModule.setup(); });
  assert.equal(output, "");
  moduleTester.passed++;
});

var redis = require("redis");

testHelper.test("required redis.createClient() redefined", function () {
  var expected = "function () {var args = sc.redefineProps(arguments, [props.port, props.host]);var client = oldConnect.apply(this, args);if (props.password !== null) client.auth_pass = props.password;return client;}";
  var actual = redis.createClient.toString();

  assert.equal(testHelper.comparePart(actual), testHelper.comparePart(expected));
  moduleTester.passed++;
});

testHelper.test("required redis.RedisClient.auth() redefined", function () {
  var expected = "function () {var args = sc.redefineProps(arguments, [props.password]);return oldAuth.apply(this, args);}";
  var actual = redis.RedisClient.prototype.auth.toString();

  assert.equal(testHelper.comparePart(actual), testHelper.comparePart(expected));
  moduleTester.passed++;
});
