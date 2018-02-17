'use strict';

var mysql = require('mysql'); // Database connection

var mail = require('../helpers/mail');
var error = require('../helpers/error');
var loginLog = require('../helpers/loginLog');
var auth = require('../helpers/auth');

var [dbURL, privateKey, publicKey] = require('../helpers/setupEnv').init()

console.log('PRIVATE_KEY ', privateKey);
console.log('PUBLIC_KEY ', publicKey);

const saltRounds = 10;

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
  login: login,
  register: register,
  requestRegistration: requestRegistration,
  deleteAccount: deleteAccount,
  modifyAccount: modifyAccount,
  resetPassword: resetPassword,
  getLoginLog: getLoginLog
};


function login(req, res) {
  var userName = req.swagger.params.name.value;
  var userPassword = req.swagger.params.password.value;

  var expiresInNSeconds = 15 * 60; // Expires in 15 minutes
  var expireTimestamp = Math.floor(Date.now() / 1000) + expiresInNSeconds;

  auth.findUserInDB(connection, userName)
    .then(function(user) {
      var passwordHash = user.password;
      var accountType = user.accounttype;

      return auth.verifyPassword(userPassword, passwordHash)
        .then(function(authResult) {
          let payload = {
            type: accountType,
            username: userName
          }
          return auth.generateToken(privateKey, expireTimestamp, payload)
        })
        .then(function(token) {
          return loginLog.getLastLoginTimestamp(connection, userName)
            .then(function(lastLoginTimestamp) {
              res.json({
                'jwt': token,
                'userName': userName,
                'expireTimestamp': expireTimestamp,
                'accountType': accountType,
                'lastLogin': lastLoginTimestamp
              });
              return loginLog.logInteraction(connection, userName, 'login', false, 'Successful login');
            })
        })
    })
    .catch(function(err) {
      if (err && err.code == 401 ){
        loginLog.logInteraction(connection, userName, 'login', true, 'Attempted login with wrong password');
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
      var expiresInNSeconds = 24 * 60 * 60; // Expires in 24 hours
      var expireTimestamp = Math.floor(Date.now() / 1000) + expiresInNSeconds;
      let payload = {
        type: 'user',
        action: 'registration',
        email: email
      }
      return auth.generateToken(privateKey, expireTimestamp, payload)
    })
    .then(function(token) {
      res.json('registration mail sent');

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

  auth.verifyToken(publicKey, token)
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

  auth.findUserInDB(connection, username)
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

  auth.findUserInDB(connection, username)
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

function resetPassword(req, res) {
  var email = req.swagger.params.email.value;

  auth.findUserInDB(connection, email)
    .then(function(user) {
      // Generate token that allows the user to reset the password
      var expireTimestamp = Math.floor(Date.now() / 1000) + 15 * 60; // Expires in 15 minutes
      let payload = {
        action: 'resetPassword',
        email: email
      }
      return auth.generateToken(privateKey, expireTimestamp, payload)
    })
    .then(function(token){
      // Send link to reset Password via mail

      let bodyText = `To reset your password please visit:
https://aionda-lep.herokuapp.com/register?email=${email}&token=${token}`;

      mail.send(email, 'resetPassword@aionda-lep.herokuapp.com', 'Reset password', bodyText, bodyText)
      res.json({'message': `Email with password reset link was sent to ${email}`})
    })
    .catch(function(err) {
      error.sendMsg(res, err);
    })
}

function getLoginLog(req, res){
  var token = req.swagger.params.token.value;

  auth.verifyToken(publicKey, token)
    .then(function(payload){
      var username = payload.username;
      return loginLog.getLastNLoginTimestamps(connection, username, 50)
    })
    .then(function(logEntries){
      res.send(logEntries)
    })
    .catch(function(err){
      error.sendMsg(res, err);
    })
}
