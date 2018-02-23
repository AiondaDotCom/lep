'use strict';

var error = require('../helpers/error');
var auth = require('../helpers/auth');
var connection = require('../helpers/db')

var [dbURL, privateKey, publicKey] = require('../helpers/setupEnv').init()

const saltRounds = 10;

module.exports = {
  getConfig: getConfig,
  getAccountList: getAccountList
};

function getConfig(req, res) {
  var token = req.swagger.params.token.value;

  auth.verifyToken(token)
    .then(function(payload){
      return auth.isAdmin(payload)
    })
    .then(function() {
      res.json(process.env)
    })
    .catch(function(err) {
      error.sendMsg(res, err);
    })
}

function getAccountList(req, res) {
  var token = req.swagger.params.token.value;

  auth.verifyToken(token)
    .then(function(payload){
      return auth.isAdmin(payload)
    })
    .then(function() {
      // Request list
      res.json(process.env)
    })
    .catch(function(err) {
      error.sendMsg(res, err);
    })
}
