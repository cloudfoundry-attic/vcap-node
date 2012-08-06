/*
 * Cloud Foundry modules testing helper
 */

exports.Tester = function (modulePath) {
  var Tester = {};
  Tester.passed = 0;
  Tester.reportPassed = function () {
    process.stdout.write("\033[33mTests passed: "+Tester.passed+"\033[39m\n");
  };

  process.on("exit", function () {
    Tester.reportPassed();
  });

  return Tester;
};

exports.run = function (runTests) {
  runTests = typeof runTests !== "undefined" ? runTests : "unit";
  var testModulesPath = __dirname + "/test_modules";
  var testModules = require("fs").readdirSync(testModulesPath);
  if (testModules.length == 0) {
    exports.errorMsg("Please put mongodb, mongoose, redis, pg, amqp and mysql node mosules in test_modules directory");
    process.exit(1);
  }
  process.env.NODE_PATH = testModulesPath;
  var tests = []
    , parseTests = new RegExp("-tests.js$")
    , spawn = require("child_process").spawn
    , exitcode = 0
    , files = require("fs").readdirSync(__dirname + "/" + runTests);

  files.forEach(function (file) {
    if (file.match(parseTests)) {
      tests.unshift(file);
    }
  });

  var next = function () {
    if (tests.length === 0) process.exit(exitcode);

    var file = tests.shift();
    var proc = spawn("node", [ __dirname + "/" + runTests + "/" + file ],
                     { env: process.env});

    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);

    proc.on("exit", function (code) {
      exitcode = code || 0;
      process.stdout.write("\n");
      next();
    });
  };

  next();
};

exports.test = function(msg, action) {
  process.stdout.write("Testing: "+msg+"\n");
  action();
};

exports.testsName = function(msg) {
  process.stdout.write("\033[32mTests set:\033[39m "+msg+"\n");
};

exports.errorMsg = function(msg) {
  process.stdout.write("\033[31mERROR:\033[39m "+msg+"\n")
}

exports.setBasicEnv = function () {
  var testEnv = {
  "VCAP_APP_PORT" : "5189",
  "VCAP_APP_HOST" : "127.0.0.1",
  "VCAP_APPLICATION" : "{\"instance_id\":\"c5d30e27f375ae04d712cb196e0e5d1a\",\"instance_index\":0,\"name\":\"test-app\",\"uris\":[\"test-app.test\"],\"users\":[\"tester@test\"],\"version\":\"4fbd63610fd153f777de76f0b4bfd78f63b235c7-1\",\"start\":\"2012-04-06 00:39:39 +0000\",\"runtime\":\"node\",\"state_timestamp\":1333672779,\"port\":5189,\"limits\":{\"fds\":256,\"mem\":67108864,\"disk\":2147483648},\"host\":\"localhost\"}",
  "VCAP_DEBUG_PORT": "",
  "VCAP_SERVICES": "{}"
  };
  for (var prop in testEnv) { process.env[prop] = testEnv[prop]; }
};

exports.randomName = function () {
  return "cf_testing_" +  Math.random().toString(36).substring(5);
};

exports.serviceConf = function (serviceName) {
  try {
    var servicesConf = JSON.parse(require("fs")
                              .readFileSync(__dirname + "/services.conf"
                                            , "utf8"));
  }
  catch (err) {
    errorMsg("service.conf file not found in ./tests, use services.conf.template");
    process.exit(1);
  }
  return servicesConf[serviceName];
};

exports.catchOutput = function (codeBlock) {
  var oldWrite = process.stdout.write;
  var oldErrWrite = process.stderr.write;
  var output = "";
  process.stdout.write = function (string) {
    output += string;
  };
  process.stderr.write = function (string) {
    output += string;
  };

  codeBlock();

  process.stdout.write = oldWrite;
  process.stderr.write = oldErrWrite;

  return output;
};

exports.setCloudServices = function (vcapServices) {
  process.env.VCAP_SERVICES = vcapServices;
};

exports.comparePart = function (str, length) {
  if (length === undefined) var length = 100;
  return str.replace(/[\n|\s]/mg, "").substring(0, length);
};
