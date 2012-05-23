/*
 * Cloud Foundry auto-configuration
 * Service Setup
 */

var cf = require("cf-runtime");
var glob = require("glob");
var path = require("path");

function Service () {
  this.type = "";
  this.supportedModules = {};
  this.cache = new Cache();
}

Service.prototype.setup = function () {
  if (cf.CloudApp.serviceNamesOfType[this.type] === undefined) return null;

  if (cf.CloudApp.serviceNamesOfType[this.type].length !== 1) {
    console.log("Found %d %s services. Skipping auto-configuration.", cf.CloudApp.serviceNamesOfType[this.type].length, this.type);
    return null;
  }

  var props = cf.CloudApp.serviceProps[this.type];
  var cache = this.cache;

  if (!props) return null;

  function setupModule (moduleName, cb) {
    var moduleData = null;
    try {
      moduleData = require(moduleName);
    }
    catch (e) {}
    if (moduleData !== null) {
      cb(moduleData, props);
    }
  }

  for (var moduleName in this.supportedModules) {
    var setupFunction = this.supportedModules[moduleName];
    // if module is in the basic node path
    cache.add(moduleName);
    setupModule(moduleName, setupFunction);

    // Look for modules on deeper levels
    var matches = glob.sync(path.join(process.cwd, "node_modules/**/node_modules", moduleName));
    matches.forEach(function (file) {
      file = path.resolve(path.join(process.cwd, file));
      cache.add(moduleName);
      setupModule(file, setupFunction);
    });
  }
};

Service.prototype.restoreCache = function (mainParent) {
  if (typeof this.cache !== "undefined") this.cache.restore(mainParent);
}

exports.Service = Service;

exports.redefineProps = function (oldArgs, newArgs) {
  var args = Array.prototype.slice.call(oldArgs);
  for (var i = 0; i < newArgs.length; i++) {
    args[i] = newArgs[i];
  }
  return args;
};