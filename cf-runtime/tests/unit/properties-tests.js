require(__dirname + "/../test-helper");

testsName("Application properties in the cloud");

var cf = require(__dirname + "/../../lib/index");

test("Basic properties", function () {
  assert.equal(cf.CloudApp.runningInCloud, true);
  assert.equal(cf.CloudApp.port, 5189);
  assert.equal(cf.CloudApp.host, "172.0.0.1");
  passed++;
});

test("Service properties", function () {
  assert.equal(Object.keys(cf.CloudApp.serviceProps).length, 0);
  assert.equal(cf.CloudApp.serviceNames.length, 0);
  assert.equal(Object.keys(cf.CloudApp.serviceNamesOfType).length, 0);
  assert.equal(cf.CloudApp.serviceProps.mysql, undefined);
  passed++;
});