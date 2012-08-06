/*
 * Cloud Foundry auto-configuration
 * Server connection
 *
 * Auto-configured node modules:
 *
 * "net"
 * - Server.listen()
 */

var cf = require("cf-runtime");

function Server () {
  this.cache = {};
}

Server.prototype.setup = function () {
  var net = require("net");

  var oldListen = net.Server.prototype.listen;
  this.cache["listen"] = oldListen;

  net.Server.prototype.listen = function () {
    var callArgs = Array.prototype.slice.call(arguments);
    var args = [];

    // set 1st as CF port
    // 2nd as host only if original function has it
    // pass the rest arguments as they are
    // (type checks are taken from Node.js Server.listen function)
    args[0] = cf.CloudApp.port;

    if (typeof arguments[0] == "function") {
      args = args.concat(callArgs);
      return oldListen.apply(this, args);
    }
    else if (typeof arguments[1] != "undefined" &&
             typeof arguments[1] != "function" &&
             typeof arguments[1] != "number") {
      args[1] = cf.CloudApp.host;
      args = args.concat(callArgs.slice(2));
    }
    else {
      args = args.concat(callArgs.slice(1));
    }
    return oldListen.apply(this, args);
  };
}

Server.prototype.restoreCache = function () {
  require("net").Server.prototype.listen = this.cache["listen"];
};

exports.createNew = function () {
  return new Server();
};