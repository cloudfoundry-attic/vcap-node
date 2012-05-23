/*
 * Cloud Foundry auto-configuration
 */

(function () {

  if (require("cf-runtime").CloudApp.runningInCloud) {

    var modulesList = ["server", "mongodb", "redis", "mysql", "postgresql", "rabbitmq"];
    var setupModules = {};
    modulesList.forEach(function (moduleName) {
      setupModules[moduleName] = require("./" + moduleName).createNew();
    });

    try {
      for (var i in setupModules) {
        setupModules[i].setup();
      }
    }
    catch (e) {
      // Something went wrong, rollback
      var message = "Auto-configuration for Cloud Foundry failed."
      if (e && e.message) message += " Error message: " + e.message;
      process.stderr.write(message);

      for (var i in setupModules) {
        setupModules[i].restoreCache(module.parent);
      }
    }
  }
})();
