var mysql = require('mysql');
var hlp = require('./helper');

var [mysqlConfig, privateKey, publicKey] = require('../helpers/setupEnv').init()

// Use connection pool
var connection = mysql.createPool(mysqlConfig);

module.exports = {
  connection: connection,
  healthCheck: healthCheck,
  testDatabaseConnection: testDatabaseConnection,
  tableMemoryUsage: tableMemoryUsage,
  getMYSQLConnectionCipher: getMYSQLConnectionCipher,
  getMaxAllowedPacketSize: getMaxAllowedPacketSize,
  getMYSQLUptime: getMYSQLUptime,
  getMYSQLConnections: getMYSQLConnections
};

function getMaxAllowedPacketSize() {
  return new Promise((fulfill, reject) => {
    connection.query("show variables like 'max_allowed_packet'", function (error, results, fields) {
      if (error) reject(err);

      var maxPacketSize = results[0].Value;
      fulfill(maxPacketSize);
    });
  })
}

function getTableStructure(tableName) {
  return new Promise(function (fulfill, reject) {
    connection.query('DESCRIBE ' + tableName, function (err, rows, fields) {
      if (err) {
        reject(err);
      }
      fulfill(rows);
    })
  })
}

function healthCheck() {
  console.log('Performing DB health check');

  // Check if all required tables exist and have the correct columns and types
  let tables = {
    'users': {
      'id': 'int(6) unsigned',
      'username': 'varchar(100)',
      'password': 'varchar(100)',
      'realname': 'varchar(50)',
      'accounttype': 'varchar(10)',
      'accountstate': 'varchar(100)'
    },
    'loginLog': {
      'id': 'int(6) unsigned',
      'username': 'varchar(100)',
      'action': 'varchar(100)',
      'error': 'bit(1)',
      'description': 'varchar(500)',
      'timestamp': 'timestamp',
      'ip': 'varchar(50)'
    },
    'foobar': {

    }
  }

  for (let table in tables) {
    console.log(table)
    getTableStructure(table)
      .then((rows) => {
        console.log(rows)
        console.log(`Table ${table}:`)
        for (let row of rows) {
          console.log(`  ${row.Field}\t${row.Type}`)
        }
      })
      .catch((err) => {
        console.log(err)
      })

  }
}


function testDatabaseConnection(databaseURL) {
  // If the provided URL is valid, the existing tables in the databease is returned
  // Otherwise it returns the error 400 (bad request)
  return new Promise(function (fulfill, reject) {
    try {
      // mysql.createConnection might fail, if the provided URL cannot be parsed correctly
      let testConnection = mysql.createConnection(databaseURL);
      // If mysql.createConnection doesn't fail we have to try a MYSQL command
      // to check if the connection really has worked
      testConnection.query('SHOW TABLES', function (err, rows, fields) {
        if (err) {
          reject({
            code: 400, // Bad request
            message: `Database connection failed (${err.message})`
          })
        }
        fulfill(rows);
        testConnection.end()
      })
    } catch (err) {
      reject({
        code: 400, // Bad request
        message: `Database connection failed (${err.message})`
      })
    }
  })
}


function tableMemoryUsage(dbName) {
  return new Promise((fulfill, reject) => {

    connection.query('SELECT table_name AS `table`, round((data_length + index_length), 2) `size`  FROM information_schema.TABLES  WHERE table_schema = ?', [dbName], function (err, rows, fields) {
      if (err) {
        // Something went wrong
        console.log(`Error querying memory usage: ${err}`);
        reject(err);
      } else {
        // Insertion into DB was successful
        console.log(rows);
        fulfill(rows);
      }
    });
  })
}

function getMYSQLConnectionCipher() {
  return new Promise((fulfill, reject) => {
    connection.query("SHOW STATUS LIKE 'Ssl_cipher'", function (error, results, fields) {
      if (error) reject(error);

      fulfill(results[0].Value);
    })
  })
}

function getMYSQLUptime() {
  return new Promise((fulfill, reject) => {
    connection.query("SHOW GLOBAL STATUS LIKE 'Uptime'", function (error, results, fields) {
      if (error) reject(error);

      fulfill(results[0].Value);
    })
  })
}

function getMYSQLConnections() {
  return new Promise((fulfill, reject) => {
    connection.query("show status where `variable_name` = 'Threads_connected'", function (error, results, fields) {
      if (error) reject(error);

      fulfill(results[0].Value);
    })
  })
}