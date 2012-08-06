/*
 * Cloud Foundry auto-configuration
 * Postgresql connection
 *
 * Auto-configured node modules:
 *
 * "pg" [https://github.com/brianc/node-postgres]
 * - defaults
 * - connect()
 * - new Client()
 */

var sc = require("./service");
var util = require("util");
var Cache = require("./cache").Cache;

function processConfig (config, props) {
  if (typeof config === "string") {
    config = props.url;
  }
  else {
    config = config || {};
    config.host = props.host;
    config.port = props.port;
    config.user = props.username;
    config.password = props.password;
    config.database = props.database;
  }
  return config;
}

function Postgresql () {
  this.type = "postgresql";
  this.cache = new Cache();
  this.supportedModules = {
    "pg" : function (moduleData, props) {
      // defaults
      if (moduleData.hasOwnProperty("defaults")) {
        moduleData.defaults = processConfig(moduleData.defaults, props);
      }

      // connect()
      // this module returns an object, not function, using getPrototypeOf
      if (typeof moduleData === "object") {
        var pgProto = Object.getPrototypeOf(moduleData);
        if ("connect" in pgProto) {
          var oldConnect = pgProto.connect;
          pgProto.connect = function () {
            var args = sc.redefineProps(arguments, [processConfig(arguments[0], props)]);
            return oldConnect.apply(this, args);
          };
        }
      }

      // new Client()
      if ("Client" in moduleData) {
        var oldClient = moduleData.Client;
        var oldClientProto = moduleData.Client.prototype;

        moduleData.Client = (function () {
          var Client = function () {
            var args = sc.redefineProps(arguments, [processConfig(arguments[0], props)]);
            return oldClient.apply(this, args);
          };

          for (var prop in oldClient) {
            Client[prop] = oldClient[prop];
          }

          return Client;
        })();
        moduleData.Client.prototype = oldClientProto;
      }
    }
  };
}

util.inherits(Postgresql, sc.Service);

exports.createNew = function () {
  return new Postgresql();
};