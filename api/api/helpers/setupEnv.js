'use strict';

var util = require('util');
var fs = require('fs');

module.exports.init = function () {
  var dbURL = process.env.MYSQL_CONFIG;

  var privateKey = fs.readFileSync('/srv/private.key', 'utf8');
  var publicKey = fs.readFileSync('/srv/public_key.pem', 'utf8');

  if (!dbURL) {
    throw new Error('ENV VAR "MYSQL_CONFIG" missing');
  }
  if (!privateKey) {
    throw new Error('ENV VAR "DEVEL_PRIVATE_KEY" missing');
  }
  if (!publicKey) {
    throw new Error('ENV VAR "DEVEL_PUBLIC_KEY" missing');
  }
  let saltRounds = 10;

  var mysqlConfig = JSON.parse(dbURL);

  return [mysqlConfig, privateKey, publicKey, saltRounds]
}