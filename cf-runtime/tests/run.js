var tests = [ ]
  , parseTests = new RegExp("-tests.js$")
  , testsType = process.env.TESTS || "unit"
  , spawn = require("child_process").spawn
  , exitcode = 0
  , files = require("fs").readdirSync(__dirname + "/" + testsType);

if (testsType == "unit") {
  process.stdout.write("Run with TESTS=integration to run integration tests\n\n");
}

files.forEach(function (file) {
  if (file.match(parseTests)) {
    tests.unshift(file);
  }
});

var next = function () {
  if (tests.length === 0) process.exit(exitcode);

  var file = tests.shift();
  var proc = spawn("node", [ __dirname + "/" + testsType + "/" + file ]);

  proc.stdout.pipe(process.stdout);
  proc.stderr.pipe(process.stderr);

  proc.on("exit", function (code) {
    exitcode = code || 0;
    process.stdout.write("\n");
    next();
  });
};

next();