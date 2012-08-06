var testHelper = require("./../cf-testing")
  , assert = require("assert")
  , moduleTester = new (testHelper.Tester)
  , testFileName = __dirname + "/../../lib/mysql";

testHelper.testsName("Mysql");

testHelper.setBasicEnv();

var mysqlService = "{\"mysql-5.1\":[{\"name\":\"mysql-4a891\",\"label\":\"mysql-5.1\",\"plan\":\"free\",\"tags\":[\"mysql\",\"mysql-5.1\",\"relational\"],\"credentials\":{\"name\":\"d7dacfd84882a4cb5ad91e3b4abab1737\",\"hostname\":\"172.0.0.2\",\"host\":\"172.0.0.2\",\"port\":3306,\"user\":\"uEJ2VZnypP0hl\",\"username\":\"uEJ2VZnypP0hl\",\"password\":\"pYYIRRU7oMiqJ\"}}]}";

testHelper.setCloudServices(mysqlService);
var testedModule = require(testFileName).createNew();

var mysql = require("mysql");

testHelper.test("No skipping", function () {
  var output = testHelper.catchOutput(function () { testedModule.setup(); });
  assert.equal(output, "");
  moduleTester.passed++;
});

if (typeof mysql.createClient !== "undefined") {
  testHelper.test("required mysql.createClient() redefined", function () {
    var expected = "function () {var options = arguments[0] || {};options.host = props.host;options.port = props.port;options.user = props.username;options.password = props.password;options.database = props.database;";
    var actual = mysql.createClient.toString();
    assert.equal(testHelper.comparePart(actual), testHelper.comparePart(expected));
    moduleTester.passed++;
  });
}
