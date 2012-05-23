var testHelper = require("./../cf-testing")
  , assert = require("assert")
  , moduleTester = new (testHelper.Tester);

testHelper.testsName("Mysql");

var serviceConf = testHelper.serviceConf("mysql");

var vcapServices = {
  "mysql-5.1" : [{
    "name" : "mysql-test-service",
    "label" : "mysql-5.1",
    "credentials": serviceConf
  }]
};

testHelper.setBasicEnv();
testHelper.setCloudServices(JSON.stringify(vcapServices));

var host = "mongodb://mysql-url" + testHelper.randomName();
var username = "username_" + testHelper.randomName();
var password = "password_" + testHelper.randomName();

require(__dirname + "/../../lib/index.js");

var mysql = require("mysql");

if (typeof mysql.createClient !== "undefined") {

  testHelper.test("mysql.createClient()", function () {
    var client = mysql.createClient({
      user: username,
      password: password,
      host: host
    });

    assert.equal(client.host, serviceConf.host);
    assert.equal(client.port, serviceConf.port);
    assert.equal(client.user, serviceConf.username);
    assert.equal(client.password, serviceConf.password);
    assert.equal(client.database, serviceConf.name);

    client.destroy();

    moduleTester.passed++;
  });
}

if (typeof mysql.Client !== "undefined") {

  testHelper.test("mysql.new Client()", function () {
    var Client = mysql.Client;
    var client = new Client({
      user: username,
      password: password,
      host: host
    });
    client.connect();
    assert.equal(client.host, serviceConf.host);
    assert.equal(client.port, serviceConf.port);
    assert.equal(client.user, serviceConf.username);
    assert.equal(client.password, serviceConf.password);
    assert.equal(client.database, serviceConf.name);

    client.end();

    moduleTester.passed++;
  });
}

if (typeof mysql.createConnection !== "undefined") {

  testHelper.test("mysql.createConnection()", function () {
    var connection = mysql.createConnection({
      user: username,
      password: password,
      host: host
    });

    connection.connect(function(err) {
      assert.equal(err, null);
      assert.equal(connection.config.host, serviceConf.host);
      assert.equal(connection.config.port, serviceConf.port);
      assert.equal(connection.config.user, serviceConf.username);
      assert.equal(connection.config.password, serviceConf.password);
      assert.equal(connection.config.database, serviceConf.name);

      connection.destroy();
    });

    moduleTester.passed++;
  });

}