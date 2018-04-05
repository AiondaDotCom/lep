var mysql = require('mysql');

var [dbURL, privateKey, publicKey] = require('../helpers/setupEnv').init()

console.log('PRIVATE_KEY ', privateKey);
console.log('PUBLIC_KEY ', publicKey);

console.log('CONNECTING TO MYSQL ', dbURL);
if (process.env.DEVELOPMENT) {
  // Connect without SSL enabled
  console.log('DEVEL CONFIG');
  var connection = mysql.createConnection(dbURL);
} else {
  // Use SSL in production environment
  // As the mysql database runs on Amazon servers, using the profile "Amazon RDS"
  // enables the correct certificate
  // https://rds.amazonaws.com/doc/rds-ssl-ca-cert.pem
  // https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem
  console.log('PRODUCTION CONFIG');
  var connection = mysql.createConnection(dbURL + "?ssl=Amazon RDS");
}

connection.connect();

module.exports = {
  connection: connection,
  healthCheck: healthCheck,
  testDatabaseConnection: testDatabaseConnection
};

function getTableStructure(tableName) {
  return new Promise(function(fulfill, reject) {
    connection.query('DESCRIBE ' + tableName, function(err, rows, fields) {
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
  return new Promise(function(fulfill, reject) {
      try {
        // mysql.createConnection might fail, if the provided URL cannot be parsed correctly
        let testConnection = mysql.createConnection(databaseURL);
        // If mysql.createConnection doesn't fail we have to try a MYSQL command
        // to check if the connection really has worked
        testConnection.query('SHOW TABLES', function(err, rows, fields) {
          if (err) {
            reject({
              code: 400, // Bad request
              message: `Database connection failed (${err.message})`
            })
          }
          fulfill(rows);
          testConnection.end()
        })
      }
      catch (err) {
        reject({
          code: 400, // Bad request
          message: `Database connection failed (${err.message})`
        })
      }
  })
}
