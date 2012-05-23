var testHelper = require("./cf-testing");

var runTests = process.env.TESTS || "unit";

if (runTests !== "integration") {
  process.stdout.write("Run with TESTS=integration to run integration tests\n\n");
}

testHelper.run(runTests);
