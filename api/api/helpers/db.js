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

module.exports = connection;
