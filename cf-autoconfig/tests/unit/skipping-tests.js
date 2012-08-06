var testHelper = require("./../cf-testing")
  , assert = require("assert")
  , path = require("path")
  , moduleTester = new (testHelper.Tester)
  , testDir = __dirname + "/../../lib";

testHelper.testsName("Auto-configuration is skipped");

testHelper.setBasicEnv();

var mongoServices = "\"mongodb-1.8\":[{\"name\":\"mongodb-1\",\"label\":\"mongodb-1.8\",\"plan\":\"free\",\"tags\":[\"mongodb\",\"mongodb-1.6\",\"nosql\"],\"credentials\":{\"hostname\":\"172.0.0.2\",\"host\":\"172.0.0.2\",\"port\":25009,\"username\":\"301067ea\",\"password\":\"db0c339e\",\"name\":\"e808e1b7\",\"db\":\"db\"}},{\"name\":\"mongodb-2\",\"label\":\"mongodb-1.8\",\"plan\":\"free\",\"tags\":[\"mongodb\",\"mongodb-1.6\",\"nosql\"],\"credentials\":{\"hostname\":\"172.0.0.2\",\"host\":\"172.0.0.2\",\"port\":25009,\"username\":\"301067ea\",\"password\":\"db0c339e\",\"name\":\"e808e1b7\",\"db\":\"db\"}}]";

var redisServices = "\"redis-2.2\":[{\"name\":\"redis-c53d8\",\"label\":\"redis-2.2\",\"plan\":\"free\",\"tags\":[\"redis\",\"redis-2.2\",\"key-value\",\"nosql\"],\"credentials\":{\"hostname\":\"172.0.0.2\",\"host\":\"172.0.0.2\",\"port\":5116,\"password\":\"dc62e534\",\"name\":\"efe7eea2\"}},{\"name\":\"redis-97334\",\"label\":\"redis-2.2\",\"plan\":\"free\",\"tags\":[\"redis\",\"redis-2.2\",\"key-value\",\"nosql\"],\"credentials\":{\"hostname\":\"172.0.0.2\",\"host\":\"172.0.0.2\",\"port\":5020,\"password\":\"eec8ae29\",\"name\":\"743563ae\"}}]";

var mysqlServices = "\"mysql-5.1\":[{\"name\":\"mysql-4a891\",\"label\":\"mysql-5.1\",\"plan\":\"free\",\"tags\":[\"mysql\",\"mysql-5.1\",\"relational\"],\"credentials\":{\"name\":\"d7dacfd84882a4cb5ad91e3b4abab1737\",\"hostname\":\"172.0.0.2\",\"host\":\"172.0.0.2\",\"port\":3306,\"user\":\"uEJ2VZnypP0hl\",\"username\":\"uEJ2VZnypP0hl\",\"password\":\"pYYIRRU7oMiqJ\"}},{\"name\":\"mysql-a1fd2\",\"label\":\"mysql-5.1\",\"plan\":\"free\",\"tags\":[\"mysql\",\"mysql-5.1\",\"relational\"],\"credentials\":{\"name\":\"d37a5a27bd1e54290856dc18dc5c31880\",\"hostname\":\"172.0.0.2\",\"host\":\"172.0.0.2\",\"port\":3306,\"user\":\"u8k05hIKi1xSy\",\"username\":\"u8k05hIKi1xSy\",\"password\":\"ppkeiikwAh5xV\"}}]";

testHelper.setCloudServices("{" + mongoServices + ", " + redisServices + ", " + mysqlServices + "}");

testHelper.test("for 2 mongo services", function () {
  var testedModule = require(path.join(testDir, "/mongodb")).createNew();
  var output = testHelper.catchOutput(function () { testedModule.setup(); });
  assert.equal(output, "Found 2 mongodb services. Skipping auto-configuration.\n");
  moduleTester.passed++;
});

testHelper.test("for 2 redis services", function () {
  var testedModule = require(path.join(testDir, "/redis")).createNew();
  var output = testHelper.catchOutput(function () { testedModule.setup(); });
  assert.equal(output, "Found 2 redis services. Skipping auto-configuration.\n");
  moduleTester.passed++;
});

testHelper.test("for 2 mysql services", function () {
  var testedModule = require(path.join(testDir, "/mysql")).createNew();
  var output = testHelper.catchOutput(function () { testedModule.setup(); });
  assert.equal(output, "Found 2 mysql services. Skipping auto-configuration.\n");
  moduleTester.passed++;
});