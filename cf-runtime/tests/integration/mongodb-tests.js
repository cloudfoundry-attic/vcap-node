require(__dirname + "/../test-helper");

testsName("Mongodb client");

var vcapServices = {
  "mongodb-1.8" : [{
    "name" : "mongodb-test-service",
    "label" : "mongodb-1.8",
    "credentials": servicesConf.mongodb
  }]
};

process.env.VCAP_SERVICES = JSON.stringify(vcapServices);

var cf = require(cfruntimePath);

var testMongodbConnection = function (err, db) {
  assert.equal(err, null);
  var collName = randomName();

  db.collection(collName, function (err, coll) {
    assert.equal(err, null);

    var data_to_insert = [{ hello : "world_safe" }];

    coll.insert(data_to_insert, { safe : true }, function (err, result) {
      assert.equal(err, null);

      coll.findOne({ hello: "world_safe" }, function (err, item) {
        assert.equal(err, null);
        assert.equal(item.hello, "world_safe");

        db.dropCollection(collName, function (err, result) {
          assert.equal(err, null);

          db.close();
          passed++;
        });
      });
    });
  });
};

test("create", function () {
  cf.MongoClient.create(testMongodbConnection);
});

test("create from service", function() {
  cf.MongoClient.createFromSvc("mongodb-test-service", testMongodbConnection);
});