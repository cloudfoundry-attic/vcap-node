/*
 * Cloud Foundry auto-configuration
 * Mysql connection
 *
 * Auto-configured node modules:
 *
 * "mysql" [https://github.com/felixge/node-mysql]
 * - createClient()
 * - Client._connect()
 * - Client.connect()
 * - createConnection()
 */

var sc = require("./service");
var util = require("util");
var Cache = require("./cache").Cache;

function Mysql () {
  this.type = "mysql";
  this.cache = new Cache();
  this.supportedModules = {
    "mysql" : function (moduleData, props) {

      // createClient()
      if ("createClient" in moduleData) {
        var oldCreateClient = moduleData.createClient;
        var oldCreateClientProto = moduleData.createClient.prototype;

        moduleData.createClient = function () {
          var options = arguments[0] || {};
          options.host = props.host;
          options.port = props.port;
          options.user = props.username;
          options.password = props.password;
          options.database = props.database;
          var args = sc.redefineProps(arguments, [options]);
          return oldCreateClient.apply(this, args);
        };
        moduleData.createClient.prototype = oldCreateClientProto;
      }

      // Client.connect()
      if ("Client" in moduleData && "connect" in moduleData.Client.prototype) {
        var oldClientConnect = moduleData.Client.prototype.connect;
        moduleData.Client.prototype.connect = function () {
          this.host = props.host;
          this.port = props.port;
          this.user = props.username;
          this.password = props.password;
          this.database = props.database;
          return oldClientConnect.apply(this, arguments);
        };
      }

      // Client._connect()
      if ("Client" in moduleData && "_connect" in moduleData.Client.prototype) {
        var oldClientConnectAuto = moduleData.Client.prototype._connect;
        moduleData.Client.prototype._connect = function () {
          this.host = props.host;
          this.port = props.port;
          this.user = props.username;
          this.password = props.password;
          this.database = props.database;
          return oldClientConnectAuto.apply(this, arguments);
        };
      }

      // createConnection()
      if ("createConnection" in moduleData) {
        var oldCreateConnection = moduleData.createConnection;
        var oldCreateConnectionProto = moduleData.createConnection.prototype;

        moduleData.createConnection = function () {
          var options = arguments[0] || {};
          options.host = props.host;
          options.port = props.port;
          options.user = props.username;
          options.password = props.password;
          options.database = props.database;
          var args = sc.redefineProps(arguments, [options]);
          return oldCreateConnection.apply(this, args);
        };
        moduleData.createConnection.prototype = oldCreateConnectionProto;
      }
    }
  };
}

util.inherits(Mysql, sc.Service);

exports.createNew = function () {
  return new Mysql();
};
