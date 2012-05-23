/*
 * Cloud Foundry auto-configuration
 * Cache state management
 */

function Cache () {
  this.modified = [];
  this.added = [];
}

Cache.prototype.add = function (moduleName) {
  var modulePath = null;
  try {
    modulePath = require.resolve(moduleName);
  }
  catch (e) {
    // Module can not be resolved
    return null;
  }
  if (typeof require.cache[modulePath] === "undefined") {
    this.added.push(modulePath);
  }
  else {
    this.modified.push(modulePath);
  }
}

// Cleaning cache state
Cache.prototype.restore = function (mainParent) {
  this.added.forEach(function (pathIndex) {
    if (typeof require.cache[pathIndex] !== "undefined") delete require.cache[pathIndex];
  });
  this.modified.forEach(function (pathIndex) {
    if (typeof require.cache[pathIndex] !== "undefined") delete require.cache[pathIndex];
    try {
      if (typeof mainParent === "object" && mainParent !== null) {
        // Looks like mainParent is module
        mainParent.require(pathIndex);
      }
      else {
        // Just require from current module (there are might be some different references)
        require(pathIndex);
      }
    }
    catch (e) {
      var message = "Cache rollback failed."
      if (e && e.message) message += " Error message: " + e.message;
      process.stderr.write(message);
    }
  });
}

exports.Cache = Cache;
