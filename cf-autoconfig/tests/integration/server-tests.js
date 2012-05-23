var testHelper = require("./../cf-testing")
  , assert = require("assert")
  , fs = require('fs')
  , moduleTester = new (testHelper.Tester);

testHelper.testsName("Server");
var serviceConf = testHelper.serviceConf("mongodb");

testHelper.setBasicEnv();
require(__dirname + "/../../lib/index.js");

var randomHost = "original-host-" + testHelper.randomName();

testHelper.test("http.listen()", function (finished) {
  testServer("http", function () {
    testHelper.test("https.listen()", function (finished) {
      testServer("https", function () {});
    });
  });
});

function testServer (moduleName, callback) {
  var options = {
    key: fs.readFileSync(__dirname + "/../fixtures/server.key"),
    cert: fs.readFileSync(__dirname + "/../fixtures/server.crt")
  };

  var reqListener = function (req, res) {
    res.end(req.headers.host);
  };

  if (moduleName === "https")
    var server = require(moduleName).createServer(options, reqListener);
  else
    var server = require(moduleName).createServer(reqListener);

  server.listen(8080, randomHost);
  server.on("close", callback);

  reqTestServer(moduleName, function (res) {
    assert.equal(res, "127.0.0.1:5189");
    server.close();
    moduleTester.passed++;
  });
}

function reqTestServer (moduleName, callback) {
  require(moduleName).request({
    host : "127.0.0.1",
    port : "5189"
  }, function (res) {
    var body = "";
    res.on("data", function (chunk) {
      body += chunk;
    });
    res.on("end", function () {
      callback.call(this, body);
    });
  }).end();
}