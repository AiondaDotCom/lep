'use strict';

var util = require('util');
var mysql = require('mysql'); // Database connection
var jwt = require('jsonwebtoken'); // Generate and verify jwts
var bcrypt = require('bcrypt'); // Hash passwords

var mail = require('../helpers/mail');


var loginLog = require('./loginLog');
var auth = require('./auth');

var dbURL = process.env.JAWSDB_URL;
if (!dbURL) {
  throw new Error('ENV VAR "JAWSDB_URL" missing');
}

var privateKey = process.env.DEVEL_PRIVATE_KEY;
var publicKey = process.env.DEVEL_PUBLIC_KEY;

if (!privateKey) {
  throw new Error('ENV VAR "DEVEL_PRIVATE_KEY" missing');
}
if (!publicKey) {
  throw new Error('ENV VAR "DEVEL_PUBLIC_KEY" missing');
}
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
  modifyAccount: modifyAccount
};



function sendErrorMsg(res, err) {
  console.log(err);
  if (err && err.code && err.message) {
    res.status(err.code);
    res.json({
      'message': err.message
    });
  } else {
    res.status(500);
    res.json({
      'message': 'Internal Server Error'
    });
  }
}


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
            type: accountType
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
      sendErrorMsg(res, err);
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
      sendErrorMsg(res, err)
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
      sendErrorMsg(res, err);
    })
}



function deleteAccount(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var userName = req.swagger.params.name.value;
  var userPassword = req.swagger.params.password.value;

  connection.query('SELECT * FROM users WHERE username=?', [userName], function(err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500); // Internal Server error
      res.json({
        'message': 'Internal server error'
      });
    } else {
      console.log(rows);
      if (rows.length > 0) {
        // An entry for the given username was fond in the DB
        var passwordHash = rows[0]['password'];

        // Check if the password is correct
        bcrypt.compare(userPassword, passwordHash, function(err, authRes) {
          if (authRes) {
            // User and password are in DB
            // Delete requested account
            connection.query('DELETE FROM users WHERE username = ?', [userName], function(err, rows, fields) {
              if (err) {
                console.log(err);
                res.status(500); // Internal Server error
                res.json({
                  'message': 'Internal server error'
                });
              } else {
                res.json({
                  'message': 'User deleted'
                });
              }
            });

          } else {
            // Password is invalid
            res.status(401); // 401 Unauthorized
            res.json({
              'message': 'Wrong credentials. Access denied!'
            });
          }
        });
      } else {
        // Username not found in database
        res.status(401); // 401 Unauthorized
        res.json({
          'message': 'Wrong credentials. Access denied!'
        });
      }
    }
  });
}



function modifyAccount(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var userName = req.swagger.params.name.value;
  var userPassword = req.swagger.params.password.value;
  var newPassword = req.swagger.params.newpassword.value;

  connection.query('SELECT * FROM users WHERE username=?', [userName], function(err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500); // Internal Server error
      res.json({
        'message': 'Internal server error'
      });
    } else {
      console.log(rows);
      if (rows.length > 0) {
        // An entry for the given username was fond in the DB
        var passwordHash = rows[0]['password'];

        // Check if the password is correct
        bcrypt.compare(userPassword, passwordHash, function(err, authRes) {
          if (authRes) {
            // User and password are in DB
            // Modify password
            res.status(404);
            res.json({
              'message': 'Not implemented yet'
            });
            // TODO: IMPLEMENT ME

          } else {
            // Password is invalid
            res.status(401); // 401 Unauthorized
            res.json({
              'message': 'Wrong credentials. Access denied!'
            });
          }
        });
      } else {
        // Username not found in database
        res.status(401); // 401 Unauthorized
        res.json({
          'message': 'Wrong credentials. Access denied!'
        });
      }
    }
  });
}
