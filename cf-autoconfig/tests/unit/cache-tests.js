var testHelper = require("./../cf-testing")
  , assert = require("assert")
  , moduleTester = new (testHelper.Tester)
  , testFileName = __dirname + "/../../lib/cache";

testHelper.testsName("Cache");

testHelper.setBasicEnv();

var Cache = require(testFileName).Cache;

var cache = new Cache();

var modifiedModule = require.resolve(__dirname + "/../../lib/redis");
var addedModule = require.resolve(__dirname + "/../../lib/mysql");

var originalModule = require(modifiedModule);

function addToCache(cache, cb) {
  cache.add(addedModule);
  assert.equal(cache.added[0], addedModule);
  moduleTester.passed++;
  cb(cache);
}

function modifyCache (cache, cb) {
  cache.add(modifiedModule);
  assert.equal(cache.modified[0], modifiedModule);
  moduleTester.passed++;
  cb(cache);
}

// This tests should run serially because they depend on previous

testHelper.test("Adding new object to cache", function () {
  addToCache(cache, function () {

    testHelper.test("Modify object in cache", function () {
      modifyCache(cache, function () {

        testHelper.test("Reset cache", function () {
          // Changed some properties before reset
          originalModule.createNew = "modified";
          assert.equal(typeof require(modifiedModule).createNew, "string");

          cache.restore(module.parent);

          // Modified module should be restored, added module should be removed from cache
          assert.notEqual(typeof require.cache[modifiedModule], "undefined");
          assert.equal(typeof require(modifiedModule).createNew, "function");
          assert.equal(typeof require.cache[addedModule], "undefined");
          moduleTester.passed++;
        });
      });
    });
  });
});