require(__dirname + "/../test-helper");

testsName("Postgresql client");

var vcapServices = {
  "postgresql-9.0" : [{
    "name" : "postgresql-test-service",
    "label" : "postgresql-9.0",
    "credentials": servicesConf.postgresql
  }]
};

process.env.VCAP_SERVICES = JSON.stringify(vcapServices);

var cf = require(cfruntimePath);

var testPGConnection = function (err, client) {
  assert.equal(err, null);
  var tableName = randomName();

  // temp tables for postgresql not supported
  client.query("drop table if exists " + tableName);
  process.on("exit", function () {
    if (client) client.query("drop table if exists " + tableName);
  });

  client.query("create table " + tableName + " (world_safe varchar(255))", function (err) {
    assert.equal(err, null);
    client.query("insert into " + tableName + " values ('OK')");

    var query = client.query("select * from "+tableName, function (err) {
      assert.equal(err, null);
    });

    query.on("row", function(row) {
      assert.equal(row.world_safe, "OK");
    });

    query.on("end", function() {
      client.query("drop table if exists " + tableName);
      client.end();
      passed++;
    });
  });
};

test("create", function () {
  cf.PGClient.create(testPGConnection);
});

test("create from service", function () {
  cf.PGClient.createFromSvc("postgresql-test-service", testPGConnection);
});
