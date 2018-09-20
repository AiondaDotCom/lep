'use strict';

var error = require('../helpers/error');
var auth = require('../helpers/auth');
var db = require('../helpers/db');
var connection = db.connection;

var [dbURL, privateKey, publicKey] = require('../helpers/setupEnv').init()

const saltRounds = 10;

module.exports = {
  verifyToken: verifyToken,
  testDatabaseConnection: testDatabaseConnection
};


function verifyToken(req, res) {
  var setupToken = req.swagger.params.setupToken.value;
  auth.verifyToken(setupToken)
    .then(function (payload) {
      return auth.verifyTokenAction(payload, 'setup')
    })
    .then(() => {
      res.json({
        'message': `Token valid`
      })
    })
    .catch(function (err) {
      error.sendMsg(res, err);
    })
}

function testDatabaseConnection(req, res) {
  var setupToken = req.swagger.params.setupToken.value;
  var databaseURL = req.swagger.params.url.value;

  auth.verifyToken(setupToken)
    .then(function (payload) {
      return auth.verifyTokenAction(payload, 'setup')
    })
    .then(function () {
      return db.testDatabaseConnection(databaseURL)
    })
    .then(function () {
      res.json({
        'message': `MYSQL connection was successful (${databaseURL})`
      })
    })
    .catch(function (err) {
      error.sendMsg(res, err);
    })
}