'use strict';

var error = require('../helpers/error');
var auth = require('../helpers/auth');
var db = require('../helpers/db');
var connection = db.connection;
var settings = require('../helpers/settings');

var [dbConfig, privateKey, publicKey] = require('../helpers/setupEnv').init()

const saltRounds = 10;

module.exports = {
  status: status,
  getConfig: getConfig,
  getAccountList: getAccountList,
  createAccount: createAccount,
  addDomainToWhitelist: addDomainToWhitelist,
  removeDomainFromWhitelist: removeDomainFromWhitelist,
  deleteAccount: deleteAccount
};

function status(req, res) {
  var token = req.swagger.params.token.value;

  auth.verifyToken(token)
    .then(function (payload) {
      return auth.isAdmin(payload)
    })
    .then(function () {
      var tableMemoryUsagePromise = db.tableMemoryUsage(dbConfig.database);
      var mysqlCipherPromise = db.getMYSQLConnectionCipher();
      var maxPacketSizePromise = db.getMaxAllowedPacketSize();
      var uptimePromise = db.getMYSQLUptime();
      var connectionsPromise = db.getMYSQLConnections();

      return Promise.all([
        tableMemoryUsagePromise,
        mysqlCipherPromise,
        maxPacketSizePromise,
        uptimePromise,
        connectionsPromise
      ])
    })
    .then((result) => {
      res.json({
        memoryUsage: result[0],
        mysqlCipher: result[1],
        maxAllowedPacketSize: result[2],
        uptime: result[3],
        connections: result[4],
        db: {
          connectionLimit: dbConfig.connectionLimit,
          host: dbConfig.host,
          database: dbConfig.database
        }
      })
    })
    .catch(function (err) {
      error.sendMsg(res, err);
    })
}

function getConfig(req, res) {
  var token = req.swagger.params.token.value;

  auth.verifyToken(token)
    .then(function (payload) {
      return auth.isAdmin(payload)
    })
    .then(() => {
      res.json({
        //'MYSQL_CONFIG': 
        // TODO: Return relevant config vars
      })
    })
    .catch(function (err) {
      error.sendMsg(res, err);
    })
}

function getAccountList(req, res) {
  var token = req.swagger.params.token.value;

  auth.verifyToken(token)
    .then(function (payload) {
      return auth.isAdmin(payload)
    })
    .then(function () {
      // Request list
      return auth.getUserList()
    })
    .then(function (userList) {
      res.json(userList)
    })
    .catch(function (err) {
      error.sendMsg(res, err);
    })
}


function deleteAccount(req, res) {
  var token = req.swagger.params.token.value;
  var deleteID = req.swagger.params.deleteID.value;

  auth.verifyToken(token)
    .then(function (payload) {
      return auth.isAdmin(payload)
    })
    .then(() => {
      // Delete account
      return auth.deleteAccount(deleteID)
    })
    .then(function (userList) {
      res.json({
        message: `Deleted Account with ID ${deleteID}`
      })
    })
    .catch(function (err) {
      error.sendMsg(res, err);
    })
}

function createAccount(req, res) {
  var token = req.swagger.params.token.value;
  var email = req.swagger.params.email.value;
  var fullName = req.swagger.params.fullName.value;
  var password = req.swagger.params.password.value;
  var accountType = req.swagger.params.accountType.value;
  var accountState = req.swagger.params.accountState.value;


  auth.verifyToken(token)
    .then(function (payload) {
      return auth.isAdmin(payload)
    })
    .then(() => {
      return new Promise(function (fulfill, reject) {
        // check if email is provided
        // TODO: is email valid and whitelisted?
        if (email == '') {
          reject({
            code: 400,
            message: 'email must not be empty'
          })
        }

        // check if fullName is provided
        if (fullName == '') {
          reject({
            code: 400,
            message: 'fullName must not be empty'
          })
        }

        // check if password is not empty
        // TODO: verify password criteria
        if (password == '') {
          reject({
            code: 400,
            message: 'password must not be empty'
          })
        }

        // check if accountType is valid
        if (!(['admin', 'moderator', 'user'].indexOf(accountType) > -1)) {
          reject({
            code: 400,
            message: 'accountType is invalid. allowed: admin/moderator/user'
          })
        }

        // check if accountState is valid
        if (!(['active', 'disabled'].indexOf(accountState) > -1)) {
          reject({
            code: 400,
            message: 'accountState is invalid. allowed: active/disabled'
          })
        }

        // Everythin seems to be fine
        fulfill(true)
      })
    })
    .then(() => {
      // Create user
      return auth.createUser(email, fullName, password, accountType, accountState)
    })
    .then(() => {
      res.json({
        message: `Created user: ${email}`
      })
    })
    .catch(function (err) {
      error.sendMsg(res, err);
    })
}

function addDomainToWhitelist(req, res) {
  var token = req.swagger.params.token.value;
  var domain = req.swagger.params.domain.value;

  auth.verifyToken(token)
    .then(function (payload) {
      return auth.isAdmin(payload)
    })
    .then(function () {
      return settings.addDomainToWhitelist(domain)
    })
    .then(function () {
      res.json({
        message: `Inserted domain ${domain} into whitelist`
      })
    })
    .catch(function (err) {
      error.sendMsg(res, err);
    })
}


function removeDomainFromWhitelist(req, res) {
  var token = req.swagger.params.token.value;
  var domain = req.swagger.params.domain.value;

  auth.verifyToken(token)
    .then(function (payload) {
      return auth.isAdmin(payload)
    })
    .then(function () {
      return settings.removeDomainFromWhitelist(domain)
    })
    .then(function () {
      res.json({
        message: `Removed domain ${domain} from whitelist`
      })
    })
    .catch(function (err) {
      error.sendMsg(res, err);
    })
}