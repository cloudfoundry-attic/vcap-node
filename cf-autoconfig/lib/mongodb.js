/*
 * Cloud Foundry auto-configuration
 * Mongodb connection
 *
 * Auto-configured node modules:
 *
 * "mongodb" [https://github.com/mongodb/node-mongodb-native]
 * - new Db()
 * - Db.connect()
 * - connect()
 * - new Server()
 * - db.authenticate()
 *
 * "mongoose" [https://github.com/learnboost/mongoose]
 * Cause it can accept any drivers besides mongodb
 * - Connection.open() (most other functions depend on this)
 */

var sc = require("./service");
var util = require("util");
var Cache = require("./cache").Cache;

function Mongodb () {
  this.type = "mongodb";

  this.cache = new Cache();

  this.supportedModules = {
    "mongodb" : function (moduleData, props) {
      // new Server()
      if ("Server" in moduleData) {
        var oldServer = moduleData.Server;
        var oldServerProto = moduleData.Server.prototype;

        moduleData.Server = function () {
          var args = sc.redefineProps(arguments, [props.host, parseInt(props.port, 10)]);
          return oldServer.apply(this, args);
        };

        moduleData.Server.prototype = oldServerProto;
      }

      // new Db()
      if ("Db" in moduleData) {
        var oldDb = moduleData.Db;
        var oldDbProto = moduleData.Db.prototype;

        moduleData.Db = (function () {
          var Db = function () {
            var args = sc.redefineProps(arguments, [props.db]);
            return oldDb.apply(this, args);
          };

          for (var prop in oldDb) {
            if (oldDb.hasOwnProperty(prop)) {
              if (prop === "connect") {
                // Db.connect()
                var oldConnect = oldDb.connect;
                Db[prop] = function () {
                  var args = sc.redefineProps(arguments, [props.url]);
                  return oldConnect.apply(this, args);
                };
              }
              else {
                Db[prop] = oldDb[prop];
              }
            }
          }

          return Db;
        })();
        moduleData.Db.prototype = oldDbProto;

        // connect() (similar to original mongodb.connect)
        moduleData.connect = moduleData.Db.connect;

        // db.authenticate()
        if ("authenticate" in moduleData.Db.prototype) {
          var oldAuthenticate = moduleData.Db.prototype.authenticate;

          moduleData.Db.prototype.authenticate = function () {
            var args = sc.redefineProps(arguments, [props.username, props.password]);
            return oldAuthenticate.apply(this, args);
          };
        }

        // db.open() adds authenticate to callback
        if ("open" in moduleData.Db.prototype) {
          var oldOpen = moduleData.Db.prototype.open;

          moduleData.Db.prototype.open = function () {
            var callback = false;
            if (typeof arguments[0] === "function") callback = arguments[0];
            var self = this;
            oldOpen.call(this, function (err, db) {
              if (err === null) {
                db.authenticate.call(self, props.username, props.password, function(err, success) {
                  if(success) {
                    if (callback) callback.call(self, null, db);
                  } else {
                    if (callback)
                      callback.call(self, err ? err : new Error("Could not authenticate user"), db);
                  }
                });
              } else {
                if (callback) callback.call(self, err, db);
              }
            });
          };
        }
      }
    },

    "mongoose" : function (moduleData, props) {
      // Connection.open()
      if ("Connection" in moduleData && "open" in moduleData.Connection.prototype) {
        var oldOpen = moduleData.Connection.prototype.open;

        moduleData.Connection.prototype.open = function () {
          var args = [];
          args.push(props.url);
          var originalOptions = null;
          var callback = null;
          // Arguments can be in different length, url, options, callback
          if (typeof arguments[arguments.length - 1] === "function") {
            callback = arguments[arguments.length - 1];
            if (typeof arguments[arguments.length - 2] === "object") {
              originalOptions = arguments[arguments.length - 2];
            }
          }
          else if (typeof arguments[arguments.length - 1] === "object") {
            originalOptions = arguments[arguments.length - 1];
          }

          if (originalOptions !== null) {
            args.push(originalOptions);
          }

          if (callback !== null) {
            args.push(callback);
          }

          return oldOpen.apply(this, args);
        };
      }
    }
  };
}

util.inherits(Mongodb, sc.Service);

exports.createNew = function () {
  return new Mongodb();
};