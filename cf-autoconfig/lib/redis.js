/*
 * Cloud Foundry auto-configuration
 * Redis connection
 *
 * Auto-configured node modules:
 *
 * "redis" [https://github.com/mranney/node_redis]
 * - createClient()
 * - auth()
 */

var sc = require("./service");
var util = require("util");
var Cache = require("./cache").Cache;

function Redis () {
  this.type = "redis";
  this.cache = new Cache();
  this.supportedModules = {
    "redis" : function (moduleData, props) {
      // auth()
      if ("RedisClient" in moduleData && "auth" in moduleData.RedisClient.prototype) {
        var oldAuth = moduleData.RedisClient.prototype.auth;

        moduleData.RedisClient.prototype.auth = function () {
          var args = sc.redefineProps(arguments, [props.password]);
          return oldAuth.apply(this, args);
        };
      }

      // createClient()
      if ("createClient" in moduleData) {
        var oldConnect = moduleData.createClient;
        var oldConnectProto = moduleData.createClient.prototype;

        moduleData.createClient = function () {
          var args = sc.redefineProps(arguments, [props.port, props.host]);
          var client = oldConnect.apply(this, args);
          if (props.password !== null) client.auth_pass = props.password;
          return client;
        };

        moduleData.createClient.prototype = oldConnectProto;
      }
    }
  };
}

util.inherits(Redis, sc.Service);

exports.createNew = function () {
  return new Redis();
};
