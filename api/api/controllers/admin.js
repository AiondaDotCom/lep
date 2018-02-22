'use strict';

var error = require('../helpers/error');
var auth = require('../helpers/auth');
var connection = require('../helpers/db')

var [dbURL, privateKey, publicKey] = require('../helpers/setupEnv').init()

const saltRounds = 10;

module.exports = {
  getConfig: getConfig
};

function getConfig(req, res) {
  var token = req.swagger.params.token.value;

  auth.verifyToken(token)
    .then(function(payload){
      return auth.isAdmin(payload)
    })
    .then(function() {
      res.json('Access granted!')
    })
    .catch(function(err) {
      error.sendMsg(res, err);
    })
}
