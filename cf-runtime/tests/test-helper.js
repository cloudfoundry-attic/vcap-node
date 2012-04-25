assert = require("assert");

test = function(msg, action) {
  process.stdout.write("Testing: "+msg+"\n");
  action();
};

testsName = function(msg) {
  process.stdout.write("\033[32mTests set:\033[39m "+msg+"\n");
};

errorMsg = function(msg) {
  process.stdout.write("\033[31mERROR:\033[39m "+msg+"\n");
};

passedMsg = function(num) {
  process.stdout.write("\033[33mTests passed: "+num+"\033[39m\n");
};

var test_env = {
  "VCAP_APP_PORT" : "5189",
  "VCAP_APP_HOST" : "172.0.0.1",
  "VCAP_APPLICATION" : "{\"instance_id\":\"c5d30e27f375ae04d712cb196e0e5d1a\",\"instance_index\":0,\"name\":\"test-app\",\"uris\":[\"test-app.test\"],\"users\":[\"tester@test\"],\"version\":\"4fbd63610fd153f777de76f0b4bfd78f63b235c7-1\",\"start\":\"2012-04-06 00:39:39 +0000\",\"runtime\":\"node\",\"state_timestamp\":1333672779,\"port\":5189,\"limits\":{\"fds\":256,\"mem\":67108864,\"disk\":2147483648},\"host\":\"172.0.0.1\"}",
  "VCAP_DEBUG_PORT": "",
  "VCAP_SERVICES": "{}"
};

setBasicEnv = function () {
  for (var prop in test_env) { process.env[prop] = test_env[prop]; }
};

resetTestEnv = function () {
  for (var prop in test_env) { delete process.env[prop]; }
};

randomName = function () {
  return "cf_runtime_test_" +  Math.random().toString(36).substring(5);
};

cfruntimePath = __dirname + "/../lib/index";

if (process.env.TESTS == "integration") {
  try {
    servicesConf = JSON.parse(require("fs")
                              .readFileSync(__dirname + "/services.conf"
                                            , "utf8"));
  }
  catch (err) {
    errorMsg("service.conf file not found in ./tests, use services.conf.template");
    process.exit(1);
  }
}

setBasicEnv();

passed = 0;

process.on("exit", function () {
  passedMsg(passed);
});
