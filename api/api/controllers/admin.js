'use strict';

var error = require('../helpers/error');
var auth = require('../helpers/auth');
var connection = require('../helpers/db').connection;

var [dbURL, privateKey, publicKey] = require('../helpers/setupEnv').init()

const saltRounds = 10;

module.exports = {
  getConfig: getConfig,
  getAccountList: getAccountList,
  addDomainToWhitelist: addDomainToWhitelist
};

function getConfig(req, res) {
  var token = req.swagger.params.token.value;

  auth.verifyToken(token)
    .then(function(payload) {
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
    .then(function(payload) {
      return auth.isAdmin(payload)
    })
    .then(function() {
      // Request list
      return auth.getUserList()
    })
    .then(function(userList) {
      res.json(userList)
    })
    .catch(function(err) {
      error.sendMsg(res, err);
    })
}

function createUser(req, res) {
  var token = req.swagger.params.token.value;

  auth.verifyToken(token)
    .then(function(payload) {
      return auth.isAdmin(payload)
    })
    .then(function() {
      // Create user
    })
    .catch(function(err) {
      error.sendMsg(res, err);
    })
}

function addDomainToWhitelist(req, res) {
  var token = req.swagger.params.token.value;
  var domain = req.swagger.params.domain.value;

  auth.verifyToken(token)
    .then(function(payload) {
      return auth.isAdmin(payload)
    })
    .then(function() {
      return auth.addDomainToWhitelist(domain)
    })
    .then(function() {
      res.json({
        message: `Inserted domain ${domain} into whitelist`
      })
    })
    .catch(function(err) {
      error.sendMsg(res, err);
    })
}
