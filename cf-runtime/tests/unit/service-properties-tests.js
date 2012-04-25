require(__dirname + "/../test-helper");

testsName("Services in the cloud");

//  1 mongodb
var mongoService = "\"mongodb-1.8\":[{\"name\":\"mongodb-1\",\"label\":\"mongodb-1.8\",\"plan\":\"free\",\"tags\":[\"mongodb\",\"mongodb-1.6\",\"nosql\"],\"credentials\":{\"hostname\":\"172.0.0.2\",\"host\":\"192.168.140.128\",\"port\":25009,\"username\":\"301067ea-bf4b-4b36-a452-fb6cffd92af5\",\"password\":\"db0c339e-a914-4ea2-94bd-76d312fd6dde\",\"name\":\"e808e1b7-83d9-4122-a0e8-0970185edc11\",\"db\":\"db\"}}]";

// 2 mysql
var mysqlService = "\"mysql-5.1\":[{\"name\":\"mysql-1\",\"label\":\"mysql-5.1\",\"plan\":\"free\",\"tags\":[\"mysql\",\"mysql-5.1\",\"relational\"],\"credentials\":{\"name\":\"da1ccee81f7a846e888c401805079db14\",\"hostname\":\"172.0.0.3\",\"host\":\"172.0.0.3\",\"port\":3306,\"user\":\"uMEsrLJeeFYCA\",\"username\":\"uMEsrLJeeFYCA\",\"password\":\"pBKOzB2vZX3qV\"}},{\"name\":\"mysql-2\",\"label\":\"mysql-5.1\",\"plan\":\"free\",\"tags\":[\"mysql\",\"mysql-5.1\",\"relational\"],\"credentials\":{\"name\":\"d04ef471a860e44c4bda070e76d24a72e\",\"hostname\":\"172.0.0.3\",\"host\":\"172.0.0.3\",\"port\":3306,\"user\":\"uXFpQUmloAPiB\",\"username\":\"uXFpQUmloAPiB\",\"password\":\"pyp1R67d0E74R\"}}]";

// 1 rabbitmq
var rabbitmqService = "\"rabbitmq-2.4\":[{\"name\":\"rabbitmq-ed563\",\"label\":\"rabbitmq-2.4\",\"plan\":\"free\",\"tags\":[\"rabbitmq\",\"rabbitmq-2.4\",\"message-queue\",\"amqp\"],\"credentials\":{\"name\":\"1bfc940d-086d-4395-bf96-b56e6f28d1e5\",\"hostname\":\"172.0.0.4\",\"host\":\"172.0.0.4\",\"port\":10027,\"vhost\":\"va1b8f13a53f94943a1d99c8818823920\",\"username\":\"uo4Dh673rwMcg\",\"user\":\"uo4Dh673rwMcg\",\"password\":\"pGoqG9V8ErMPg\",\"pass\":\"pGoqG9V8ErMPg\",\"url\":\"amqp://uo4Dh673rwMcg:pGoqG9V8ErMPg@172.0.0.4:10027/va1b8f13a53f94943a1d99c8818823920\"}}]";

var vcapServices = "{" + mongoService + ", " + mysqlService + ", " + rabbitmqService + "}";

process.env.VCAP_SERVICES = vcapServices;

var cf = require(__dirname + "/../../lib/index");

test("Basic properties", function () {
  assert.equal(cf.CloudApp.runningInCloud, true);
  assert.equal(cf.CloudApp.port, 5189);
  assert.equal(cf.CloudApp.host, "172.0.0.1");
  passed++;
});

test("Service properties and count", function () {
  assert(cf.CloudApp.serviceProps instanceof Object);

  // 2 mysql + 1 mongodb + 1 mongodb by type + 1 rabbitmq + 1 rabbitmq by type
  assert.equal(Object.keys(cf.CloudApp.serviceProps).length, 6);

  assert(cf.CloudApp.serviceNames instanceof Array);
  assert.equal(cf.CloudApp.serviceNames.length, 4);

  assert(cf.CloudApp.serviceNamesOfType instanceof Object);
  assert.equal(Object.keys(cf.CloudApp.serviceNamesOfType).length, 3);
  passed++;
});

test("General service credentials", function () {
  mysqlCreds = cf.CloudApp.serviceProps["mysql-1"];
  assert.equal(mysqlCreds.name, "mysql-1");
  assert.equal(mysqlCreds.label, "mysql");
  assert.equal(mysqlCreds.version, "5.1");
  assert.equal(mysqlCreds.database, "da1ccee81f7a846e888c401805079db14");
  assert.equal(mysqlCreds.username, "uMEsrLJeeFYCA");
  assert.equal(mysqlCreds.password, "pBKOzB2vZX3qV");
  passed++;
});

test("Mongodb service credentials", function () {
  assert.equal(cf.CloudApp.serviceProps.mongodb.db, "db");
  passed++;
});

test("Rabbitmq service credentials", function () {
  assert.equal(cf.CloudApp.serviceProps.rabbitmq.username, "uo4Dh673rwMcg");
  assert.equal(cf.CloudApp.serviceProps.rabbitmq.password, "pGoqG9V8ErMPg");
  assert.equal(cf.CloudApp.serviceProps.rabbitmq.host, "172.0.0.4");
  assert.equal(cf.CloudApp.serviceProps.rabbitmq.port, "10027");
  assert.equal(cf.CloudApp.serviceProps.rabbitmq.vhost, "va1b8f13a53f94943a1d99c8818823920");
  assert.equal(cf.CloudApp.serviceProps.rabbitmq.url, "amqp://uo4Dh673rwMcg:pGoqG9V8ErMPg@172.0.0.4:10027/va1b8f13a53f94943a1d99c8818823920");
  passed++;
});

test("If there is one service it can be accessed by its type", function () {
  assert(cf.CloudApp.serviceProps.mongodb instanceof Object);
  passed++;
});

test("If there are > 1 services they can't be accessed by type", function () {
  assert.equal(cf.CloudApp.serviceProps.mysql, undefined);
  passed++;
});

test("All services can be accessed by names", function () {
  assert(cf.CloudApp.serviceProps["mysql-1"] instanceof Object);
  assert(cf.CloudApp.serviceProps["mysql-2"] instanceof Object);
  assert(cf.CloudApp.serviceProps["mongodb-1"] instanceof Object);
  passed++;
});