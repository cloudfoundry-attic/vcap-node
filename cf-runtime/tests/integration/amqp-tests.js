require(__dirname + "/../test-helper");

testsName("AMQP client");

var vcapServices = {
  "rabbitmq-2.4" : [{
    "name" : "rabbitmq-test-service",
    "label" : "rabbitmq-2.4",
    "credentials": servicesConf.rabbitmq
  }]
};

process.env.VCAP_SERVICES = JSON.stringify(vcapServices);

var cf = require(cfruntimePath);

var testAMQPConnection = function (amqpConn) {
  amqpConn.on("error", function (e) {
    assert(false, "AMQP connection error: " + e);
  });

  amqpConn.on("ready", function () {
    var exchangeName = randomName();
    amqpConn.exchange(exchangeName, { "type" : "fanout" }, function (exchange) {
      var queueName = randomName();
      amqpConn.queue(queueName, function (q) {
        q.bind(exchangeName, "");

        q.subscribe(function (message) {
          assert.equal(message.world_safe, "OK");

          q.destroy();
          exchange.destroy();
          amqpConn.end();
          passed++;
        });

        exchange.publish("", { "world_safe" : "OK" });
      });
    });
  });
};

test("create", function () {
  var amqpConn = cf.AMQPClient.create();
  testAMQPConnection(amqpConn);
});

test("create from service", function () {
  var amqpConn = cf.AMQPClient.createFromSvc("rabbitmq-test-service");
  testAMQPConnection(amqpConn);
});