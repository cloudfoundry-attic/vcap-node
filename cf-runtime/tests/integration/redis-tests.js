require(__dirname + "/../test-helper");

testsName("Redis client");

var vcapServices = {
  "redis-2.2" : [{
    "name" : "redis-test-service",
    "label" : "redis-2.2",
    "credentials": servicesConf.redis
  }]
};

process.env.VCAP_SERVICES = JSON.stringify(vcapServices);

var cf = require(cfruntimePath);

var testRedisConnection = function (redisClient) {
  var keyName = randomName();

  redisClient.del(keyName, function (err) {
    assert.equal(err, null);

    redisClient.set(keyName, "OK", function (err) {
      assert.equal(err, null);

      redisClient.get(keyName, function (err, reply) {
        redisClient.del(keyName);

        assert.equal(err, null);
        assert.equal(reply.toString(), "OK");
        passed++;
        redisClient.end();
      });
    });
  });
};

test("create", function () {
  var redisClient = cf.RedisClient.create();
  testRedisConnection(redisClient);
});

test("create from service", function () {
  var redisClient = cf.RedisClient.createFromSvc("redis-test-service");
  testRedisConnection(redisClient);
});