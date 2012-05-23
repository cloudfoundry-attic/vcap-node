var testHelper = require("./../cf-testing")
  , assert = require("assert")
  , moduleTester = new (testHelper.Tester)
  , testFileName = __dirname + "/../../lib/postgresql";

testHelper.testsName("Postgresql");

testHelper.setBasicEnv();

var pgService = "{\"postgresql-9.0\":[{\"name\":\"postgresql-8f415\",\"label\":\"postgresql-9.0\",\"plan\":\"free\",\"tags\":[\"postgresql\",\"postgresql-9.0\",\"relational\"],\"credentials\":{\"name\":\"df6d3887bf98f445d9ac95a038c2bde37\",\"host\":\"172.0.0.2\",\"hostname\":\"172.0.0.2\",\"port\":5432,\"user\":\"u8c35b8a8f39e4b77b61b789fd9938b5b\",\"username\":\"u8c35b8a8f39e4b77b61b789fd9938b5b\",\"password\":\"p170195ddc80e45df89913270949ef693\"}}]}";

testHelper.setCloudServices(pgService);
var testedModule = require(testFileName).createNew();

testHelper.test("No skipping", function () {
  var output = testHelper.catchOutput(function () { testedModule.setup(); });
  assert.equal(output, "");
  moduleTester.passed++;
});

var pg = require("pg");

testHelper.test("required pg.defaults redefined", function () {
  assert.equal(pg.defaults.host, "172.0.0.2");
  assert.equal(pg.defaults.port, "5432");
  assert.equal(pg.defaults.user, "u8c35b8a8f39e4b77b61b789fd9938b5b");
  assert.equal(pg.defaults.password, "p170195ddc80e45df89913270949ef693");
  assert.equal(pg.defaults.database, "df6d3887bf98f445d9ac95a038c2bde37");
  moduleTester.passed++;
});

testHelper.test("required pg.connect() redefined", function () {
  var expected = "function () {var args = sc.redefineProps(arguments, [processConfig(arguments[0], props)]);return oldConnect.apply(this, args);}";
  var actual = pg.connect.toString();

  assert.equal(testHelper.comparePart(actual), testHelper.comparePart(expected));

  moduleTester.passed++;
});

var Client = pg.Client;
var testClient = new Client({});

testHelper.test("required pg new Client() redefined", function () {
  assert.equal(testClient.host, "172.0.0.2");
  assert.equal(testClient.port, "5432");
  assert.equal(testClient.user, "u8c35b8a8f39e4b77b61b789fd9938b5b");
  assert.equal(testClient.password, "p170195ddc80e45df89913270949ef693");
  assert.equal(testClient.database, "df6d3887bf98f445d9ac95a038c2bde37");
  moduleTester.passed++;
});
