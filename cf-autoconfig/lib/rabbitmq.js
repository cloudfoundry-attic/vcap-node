/*
 * Cloud Foundry auto-configuration
 * Rabbitmq connection
 *
 * Auto-configured node modules:
 *
 * "amqp" [https://github.com/postwait/node-amqp]
 * - createConnection()
 * - new Connection()
 */

var sc = require("./service");
var util = require("util");
var Cache = require("./cache").Cache;

function Rabbitmq () {
  this.type = "rabbitmq";
  this.cache = new Cache();
  this.supportedModules = {
    "amqp" : function (moduleData, props) {
      var config = { "login" : props.username,
                     "password" : props.password,
                     "host" : props.host,
                     "port" : props.port,
                     "vhost" : props.vhost
                   };

      // connect()
      if ("createConnection" in moduleData) {
        var oldCreateConnection = moduleData.createConnection;
        var oldCreateConnectionProto = moduleData.createConnection.prototype;

        moduleData.createConnection = function () {
          var args = sc.redefineProps(arguments, [config]);
          return oldCreateConnection.apply(this, args);
        };
        moduleData.createConnection.prototype = oldCreateConnectionProto;
      }

      // new Connection()
      if ("Connection" in moduleData) {
        var oldConnection = moduleData.Connection;
        var oldConnectionProto = moduleData.Connection.prototype;

        moduleData.Connection = (function () {
          var Connection = function () {
            var args = sc.redefineProps(arguments, [config]);
            return oldConnection.apply(this, args);
          };
          for (var prop in oldConnection) {
            Connection[prop] = oldConnection[prop];
          }
          return Connection;
        })();

        moduleData.Connection.prototype = oldConnectionProto;
      }
    }
  };
}

util.inherits(Rabbitmq, sc.Service);

exports.createNew = function () {
  return new Rabbitmq();
};
