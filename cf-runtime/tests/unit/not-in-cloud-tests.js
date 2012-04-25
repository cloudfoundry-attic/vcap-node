require(__dirname + "/../test-helper");

testsName("Application not in the cloud");

resetTestEnv();

var cf = require(__dirname + "/../../lib/index");

test("Basic properties does not fail", function () {
  assert.notEqual(cf.CloudApp, undefined);
  assert.equal(cf.CloudApp.runningInCloud, false);
  assert.equal(cf.CloudApp.port, undefined);
  assert.equal(cf.CloudApp.host, undefined);
  passed++;
});

test("Service properties does not fail", function () {
  assert.equal(Object.keys(cf.CloudApp.serviceProps).length, 0);
  assert.equal(cf.CloudApp.serviceNames.length, 0);
  assert.equal(Object.keys(cf.CloudApp.serviceNamesOfType).length, 0);
  assert.equal(cf.CloudApp.serviceProps.mysql, undefined);
  passed++;
});