require(__dirname + "/../test-helper");

testsName("Mysql client");

var vcapServices = {
  "mysql-5.1" : [{
    "name" : "mysql-test-service",
    "label" : "mysql-5.1",
    "credentials": servicesConf.mysql
  }]
};

process.env.VCAP_SERVICES = JSON.stringify(vcapServices);

var cf = require(cfruntimePath);

var testMysqlConnection = function (mysqlClient) {
  var tableName = randomName();
  mysqlClient.query("create temporary table " + tableName + " (world_safe varchar(255))",
  function (err) {
    assert.equal(err, null);

    mysqlClient.query("insert into " + tableName + " values ('OK')");
    mysqlClient.query("select * from " + tableName,
    function (err, results, fields) {
      assert.equal(err, null);
      assert.equal(results[0].world_safe, "OK");

      mysqlClient.end();
      passed++;
    });
  });
};

test("create", function () {
  var mysqlClient = cf.MysqlClient.create();
  testMysqlConnection(mysqlClient);
});

test("create from service", function () {
  var mysqlClient = cf.MysqlClient.createFromSvc("mysql-test-service");
  testMysqlConnection(mysqlClient);
});