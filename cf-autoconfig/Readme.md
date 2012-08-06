# cf-autoconfig

cf-autoconfig is a Node.js module that reconfigures server and service functions so they can automatically run on Cloud Foundry without manual configuration.

## Installation

```bash
npm install cf-autoconfig
```

If cloned from github install dependencies:

```bash
npm install -d
```

## Usage

Require this on the first line of your start script:

```js
require("cf-autoconfig");
```

That's it!

## Reconfigured functions

cf-autoconfig reconfigures functions of modules listed below if they are accessible in node require path or on any level of node_modules folder tree. This means that any modules that depend on these reconfigured modules will also be reconfigured.

### Server setup

Core module: "net"
Functions:
* Server.listen()

Plus all functions that inherit from this one. This includes core http.Server.listen and https.Server.listen. And node modules functions that wrap this one, like express's app.listen function.

### Mongodb connection

Module: [mongodb](https://github.com/mongodb/node-mongodb-native)
Functions:
* connect()
* new Db()
* new Server()
* db.authenticate()

Module: [mongoose](https://github.com/learnboost/mongoose)
* Connection.open() (and other mongoose functions that wrap this one)

### Mysql connection

Module: [mysql](https://github.com/felixge/node-mysql)
Functions:
* createClient()
* Client._connect() (other functions and modules use this for auto connect)

### Postgresql connection

Module: [pg](https://github.com/brianc/node-postgres)
Functions:
* defaults (default connection variables)
* connect()
* new Client()

### Redis connection

Module: [redis](https://github.com/mranney/node_redis)
Functions:
* createClient()
* auth()

### Rabbitmq connection

Module: [amqp](https://github.com/postwait/node-amqp)
Functions:
* createConnection()
* new Connection()
