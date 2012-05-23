require(__dirname + "/../test-helper");

testsName("Services in the cloud");

//  1 mongodb
var mongoService = "\"mongodb-1.8\":[{\"name\":\"mongodb-1\",\"label\":\"mongodb-1.8\",\"plan\":\"free\",\"tags\":[\"mongodb\",\"mongodb-1.6\",\"nosql\"],\"credentials\":{\"hostname\":\"172.0.0.2\",\"host\":\"172.0.0.2\",\"port\":25009,\"username\":\"301067ea\",\"password\":\"db0c339e\",\"name\":\"e808e1b7\",\"db\":\"db\"}}]";

// 2 mysql
var mysqlService = "\"mysql-5.1\":[{\"name\":\"mysql-1\",\"label\":\"mysql-5.1\",\"plan\":\"free\",\"tags\":[\"mysql\",\"mysql-5.1\",\"relational\"],\"credentials\":{\"name\":\"da1ccee81f7a846e888c401805079db14\",\"hostname\":\"172.0.0.3\",\"host\":\"172.0.0.3\",\"port\":3306,\"user\":\"uMEsrLJeeFYCA\",\"username\":\"uMEsrLJeeFYCA\",\"password\":\"pBKOzB2vZX3qV\"}},{\"name\":\"mysql-2\",\"label\":\"mysql-5.1\",\"plan\":\"free\",\"tags\":[\"mysql\",\"mysql-5.1\",\"relational\"],\"credentials\":{\"name\":\"d04ef471a860e44c4bda070e76d24a72e\",\"hostname\":\"172.0.0.3\",\"host\":\"172.0.0.3\",\"port\":3306,\"user\":\"uXFpQUmloAPiB\",\"username\":\"uXFpQUmloAPiB\",\"password\":\"pyp1R67d0E74R\"}}]";

// 1 rabbitmq
var rabbitmqService = "\"rabbitmq-2.4\":[{\"name\":\"rabbitmq-ed563\",\"label\":\"rabbitmq-2.4\",\"plan\":\"free\",\"tags\":[\"rabbitmq\",\"rabbitmq-2.4\",\"message-queue\",\"amqp\"],\"credentials\":{\"name\":\"1bfc940d-086d-4395-bf96-b56e6f28d1e5\",\"hostname\":\"172.0.0.4\",\"host\":\"172.0.0.4\",\"port\":10027,\"vhost\":\"va1b8f13a53f94943a1d99c8818823920\",\"username\":\"uo4Dh673rwMcg\",\"user\":\"uo4Dh673rwMcg\",\"password\":\"pGoqG9V8ErMPg\",\"pass\":\"pGoqG9V8ErMPg\",\"url\":\"amqp://uo4Dh673rwMcg:pGoqG9V8ErMPg@172.0.0.4:10027/va1b8f13a53f94943a1d99c8818823920\"}}]";

var redisService = "\"redis-2.2\":[{\"name\":\"redis-627d\",\"label\":\"redis-2.2\",\"plan\":\"free\",\"tags\":[\"redis\",\"redis-2.2\",\"key-value\",\"nosql\"],\"credentials\":{\"hostname\":\"172.0.0.5\",\"host\":\"172.0.0.5\",\"port\":5029,\"password\":\"d7015485\",\"name\":\"6ff0d703\"}}]";

var pgService = "\"postgresql-9.0\":[{\"name\":\"postgresql-8f415\",\"label\":\"postgresql-9.0\",\"plan\":\"free\",\"tags\":[\"postgresql\",\"postgresql-9.0\",\"relational\"],\"credentials\":{\"name\":\"df6d3887\",\"host\":\"172.0.0.6\",\"hostname\":\"172.0.0.6\",\"port\":5432,\"user\":\"u8c35b8a\",\"username\":\"u8c35b8a\",\"password\":\"p170195d\"}}]";

var vcapServices = "{"+mongoService+","+mysqlService+","+rabbitmqService+","+redisService+","+pgService+"}";

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

  // 2 mysql + 4 other + 4 by type
  assert.equal(Object.keys(cf.CloudApp.serviceProps).length, 10);

  assert(cf.CloudApp.serviceNames instanceof Array);
  assert.equal(cf.CloudApp.serviceNames.length, 6);

  assert(cf.CloudApp.serviceNamesOfType instanceof Object);
  assert.equal(Object.keys(cf.CloudApp.serviceNamesOfType).length, 5);
  passed++;
});

test("Specific mysql service credentials", function () {
  var mysqlCreds = cf.CloudApp.serviceProps["mysql-1"];
  assert.equal(mysqlCreds.name, "mysql-1");
  assert.equal(mysqlCreds.label, "mysql");
  assert.equal(mysqlCreds.version, "5.1");
  assert.equal(mysqlCreds.database, "da1ccee81f7a846e888c401805079db14");
  assert.equal(mysqlCreds.username, "uMEsrLJeeFYCA");
  assert.equal(mysqlCreds.password, "pBKOzB2vZX3qV");
  assert.equal(mysqlCreds.url, "mysql://uMEsrLJeeFYCA:pBKOzB2vZX3qV@172.0.0.3:3306/da1ccee81f7a846e888c401805079db14");
  passed++;
});

test("Mongodb service credentials", function () {
  var mongodbCreds = cf.CloudApp.serviceProps.mongodb;
  assert.equal(mongodbCreds.db, "db");
  assert.equal(mongodbCreds.username, "301067ea");
  assert.equal(mongodbCreds.password, "db0c339e");
  assert.equal(mongodbCreds.host, "172.0.0.2");
  assert.equal(mongodbCreds.port, "25009");
  assert.equal(mongodbCreds.url, "mongodb://301067ea:db0c339e@172.0.0.2:25009/db");
  passed++;
});

test("Redis service credentials", function () {
  var redisCreds = cf.CloudApp.serviceProps.redis;
  assert.equal(redisCreds.database, "6ff0d703");
  assert.equal(redisCreds.password, "d7015485");
  assert.equal(redisCreds.host, "172.0.0.5");
  assert.equal(redisCreds.port, "5029");
  assert.equal(redisCreds.url, "redis://:d7015485@172.0.0.5:5029/6ff0d703");
  passed++;
});

test("Postgresql service credentials", function () {
  var pgCreds = cf.CloudApp.serviceProps.postgresql;
  assert.equal(pgCreds.database, "df6d3887");
  assert.equal(pgCreds.username, "u8c35b8a");
  assert.equal(pgCreds.password, "p170195d");
  assert.equal(pgCreds.host, "172.0.0.6");
  assert.equal(pgCreds.port, "5432");
  assert.equal(pgCreds.url, "postgresql://u8c35b8a:p170195d@172.0.0.6:5432/df6d3887");
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