'use strict';

var mail = require('../helpers/mail');
var error = require('../helpers/error');
var loginLog = require('../helpers/loginLog');
var auth = require('../helpers/auth');
var connection = require('../helpers/db')
var helper = require('../helpers/helper');

var [dbURL, privateKey, publicKey] = require('../helpers/setupEnv').init()

const saltRounds = 10;

const tokenExpireDuration = 15*60; // 15 Minutes
const tokenMaxExpireDuration = 24*60*60; // 24 hours

const registerTokenExpireDuration = 24*60*60;

module.exports = {
  login: login,
  register: register,
  requestRegistration: requestRegistration,
  deleteAccount: deleteAccount,
  modifyAccount: modifyAccount,
  requestPasswordReset: requestPasswordReset,
  getLoginLog: getLoginLog,
  renewToken: renewToken
};

function login(req, res) {
  var userName = req.swagger.params.name.value;
  var userPassword = req.swagger.params.password.value;

  // Try to get the ip adress
  var ip = req.headers['x-forwarded-for'];

  var expireTimestamp = helper.now() + tokenExpireDuration; // Expires in 15 minutes
  var maxExpireTimestamp = helper.now() + tokenMaxExpireDuration; // 24 hours

  auth.findUserInDB(userName)
    .then(function(user) {
      var passwordHash = user.password;
      var accountType = user.accounttype;

      return auth.verifyPassword(userPassword, passwordHash)
        .then(function(authResult) {
          let payload = {
            accountType: accountType,
            username: userName,
            maxExpireTimestamp: maxExpireTimestamp,
            nRenew: 0
          }
          return auth.generateToken(expireTimestamp, payload)
        })
        .then(function(token) {
          return loginLog.getLastLoginTimestamp(userName)
            .then(function(lastLoginTimestamp) {
              res.json({
                'jwt': token,
                'userName': userName,
                'expireTimestamp': expireTimestamp,
                'accountType': accountType,
                'lastLogin': lastLoginTimestamp
              });
              return loginLog.logInteraction(userName, 'login', false, 'Successful login', ip);
            })
        })
    })
    .catch(function(err) {
      if (err && err.code == 401) {
        loginLog.logInteraction(userName, 'login', true, 'Attempted login with wrong password', ip);
      }
      error.sendMsg(res, err);
    })
}


function requestRegistration(req, res) {
  // Sends an "invitiaion"-link to the provided mailadress
  // TODO: potentially protect this endpoint via captcha
  var email = req.swagger.params.email.value;

  auth.checkEmailWhitelist(email)
    .then(function() {
      console.log('Generating invitation link and sending mail...')

      return new Promise(function(fulfill, reject) {
        connection.query('INSERT INTO users SET ?', {
          username: email,
          password: '<placeholder>',
          accounttype: 'user',
          realname: '<placeholder>',
          accountstate: 'registration_pending'
        }, function(err, rows, fields) {
          if (err) {
            if (err.code == 'ER_DUP_ENTRY') {
              // Username already exists in database
              reject({
                code: 400,
                message: `ERR: Tried to create duplicate user: ${email}`
              });
            } else {
              reject(err);
            }
          }
          // User doesnt exist, continue
          fulfill();
        })
      })
    })
    .then(function() {
      // Everything is ok, Generate TOKEN
      var expireTimestamp = helper.now() + registerTokenExpireDuration;
      let payload = {
        accountType: 'user',
        action: 'registration',
        email: email
      }
      return auth.generateToken(expireTimestamp, payload)
    })
    .then(function(token) {
      res.json({
        message: 'registration mail sent'
      });

      let bodyText = `To complete your registration please visit:\nhttps://aionda-lep.herokuapp.com/register?email=${email}&token=${token}`;
      let bodyHtml = `To complete your registration please visit:
    <a href="https://aionda-lep.herokuapp.com/register?email=${email}&token=${token}">Finish registration</a>`;

      mail.send(email, 'register@aionda-lep.herokuapp.com', 'Confirm your registration', bodyText, bodyHtml)
    })
    .catch(function(err) {
      error.sendMsg(res, err)
    })
}


function register(req, res) {
  var fullName = req.swagger.params.fullName.value;
  var password = req.swagger.params.password.value;
  var token = req.swagger.params.token.value;

  var accountType = 'user';
  // TODO: decide what accountType to use

  auth.verifyToken(token)
    .then(function(payload) {
      return new Promise(function(fulfill, reject) {
          if (payload.action == 'registration') {
            // token is valid for registration
            console.log(payload)
            fulfill()
          } else {
            // Token valid, but not assigned for registration
            reject({
              code: 401,
              message: 'Verification failed'
            })
          }
        })
        .then(function() {
          return auth.hashPassword(password, saltRounds)
        })
        .then(function(passwordHash) {
          // Password was hashed successfully, update user information
          // TODO: Prevent user from updating multiple times (verify if accountstate is 'registration_pending')
          return new Promise(function(fulfill, reject) {
            connection.query('UPDATE users SET ? WHERE username=?', [{
              password: passwordHash,
              accounttype: accountType,
              realname: fullName,
              accountstate: 'active'
            }, payload.email], function(err, rows, fields) {
              if (err) {
                // Username already exists in database
                if (err.code == 'ER_DUP_ENTRY') {
                  reject({
                    code: 400,
                    message: `User ${payload.email} already exists`
                  })
                } else {
                  reject(err)
                }
              }

              // Insertion into DB was successful
              console.log(`Inserted ${payload.email}`)
              res.json({
                'message': `User ${payload.email} created`
              });
              fulfill();
            });
          })
        })

    })
    .catch(function(err) {
      error.sendMsg(res, err)
    })
}



function deleteAccount(req, res) {
  var username = req.swagger.params.name.value;
  var password = req.swagger.params.password.value;

  auth.findUserInDB(username)
    .then(function(user) {
      var passwordHash = user.password;

      return auth.verifyPassword(password, passwordHash)
    })
    .then(function() {
      // Delete requested account
      return new Promise(function(fulfill, reject) {
        connection.query('DELETE FROM users WHERE username = ?', [username], function(err, rows, fields) {
          if (err) {
            reject(err);
          }

          res.json({
            'message': `User ${username} deleted`
          })
          fulfill();
        })
      })
    })
    .catch(function(err) {
      error.sendMsg(res, err)
    })
}


function modifyAccount(req, res) {
  var username = req.swagger.params.name.value;
  var password = req.swagger.params.password.value;
  var newPassword = req.swagger.params.newpassword.value;

  auth.findUserInDB(username)
    .then(function(user) {
      var passwordHash = user.password;
      return auth.verifyPassword(password, passwordHash)
    })
    .then(function() {
      // TODO: Implement
      res.json({
        'message': 'Not implemented yet'
      });
    })
    .catch(function(err) {
      error.sendMsg(res, err);
    })
}

function requestPasswordReset(req, res) {
  var email = req.swagger.params.email.value;

  auth.findUserInDB(email)
    .then(function(user) {
      // Generate token that allows the user to reset the password
      var expireTimestamp =  helper.now() + tokenExpireDuration;
      let payload = {
        action: 'resetPassword',
        email: email
      }
      return auth.generateToken(expireTimestamp, payload)
    })
    .then(function(token) {
      // Send link to reset Password via mail

      let bodyText = `To reset your password please visit:
https://aionda-lep.herokuapp.com/register?email=${email}&token=${token}`;

      mail.send(email, 'resetPassword@aionda-lep.herokuapp.com', 'Reset password', bodyText, bodyText)
      res.json({
        'message': `Email with password reset link was sent to ${email}`
      })
    })
    .catch(function(err) {
      error.sendMsg(res, err);
    })
}

function getLoginLog(req, res) {
  var token = req.swagger.params.token.value;

  auth.verifyToken(token)
    .then(function(payload) {
      var username = payload.username;
      console.log('getloginLog' + username)
      return loginLog.getLastNLoginTimestamps(username, 50)
    })
    .then(function(logEntries) {
      res.send(logEntries)
    })
    .catch(function(err) {
      error.sendMsg(res, err);
    })
}



function renewToken(req, res) {
  var token = req.swagger.params.token.value;

  var newExpireTimestamp = helper.now() + tokenExpireDuration;

  auth.verifyToken(token)
    .then(function(payload) {
      console.log(payload);
      var maxExpireTimestamp = payload.maxExpireTimestamp;
      return new Promise(function(fulfill, reject) {
          if (maxExpireTimestamp > helper.now()) {
            // We are allowed to renew this token
            fulfill(true);
          } else {
            // Token is not being renewed
            reject({
              code: 400, // 400 Bad Request
              message: `The token cannot be renewed. Please login again.`
            })
          }
        })
        .then(function() {
          let newPayload = {
            accountType: payload.accountType,
            username: payload.username,
            maxExpireTimestamp: payload.maxExpireTimestamp,
            nRenew: payload.nRenew + 1
          }
          return auth.generateToken(newExpireTimestamp, newPayload)
        })
        .then(function(token) {
          res.send({
            'newToken': token,
            'newExpireTimestamp': newExpireTimestamp
          })
        })
    })
    .catch(function(err) {
      error.sendMsg(res, err);
    })
}
