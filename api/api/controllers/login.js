'use strict';

var util = require('util');
var mysql = require('mysql'); // Database connection
var jwt = require('jsonwebtoken'); // Generate and verify jwts
var bcrypt = require('bcrypt'); // Hash passwords

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
  createAccount: createAccount,
  deleteAccount: deleteAccount,
  modifyAccount: modifyAccount
};

function login(req, res) {
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
            // Generate JSON Token
            console.log('Account type:', rows[0]['accounttype'])
            console.log('signing...')
            var expiresInNSeconds = 15 * 60; // Expires in 15 minutes
            var expireTimestamp = Math.floor(Date.now() / 1000) + expiresInNSeconds;
            jwt.sign({
                type: 'user',
                exp: expireTimestamp
              },
              privateKey, {
                algorithm: 'RS256'
              },
              function(err, token) {
                if (err) {
                  // Something went wrong during signing
                  console.log(err);
                  res.status(500); // Internal Server error
                  res.json({
                    'message': 'Internal server error'
                  });
                } else {
                  // Signing was successful, return the token
                  console.log(token);
                  res.json({
                    'jwt': token,
                    'userName': userName,
                    'expireTimestamp': expireTimestamp
                  });
                }
              })
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

function createAccount(req, res) {
  var userName = req.swagger.params.name.value;
  var userPassword = req.swagger.params.password.value;

  var accountType = 'admin' // TODO: decide what accountType to use
  // TODO: check if the username is valid
  //        -> is a valid mailadress
  //        -> domain is listed in police_domain_names.json

  bcrypt.hash(userPassword, saltRounds, function(err, passwordHash) {
    if (err) {
      // Problems creating hash of password
      console.log(err);
      res.status(500); // Internal Server error
      res.json({
        'message': 'Internal server error'
      });
    } else {
      // Password was hashed successfully, create new entry in 'users' table
      connection.query('INSERT INTO users (username, password, accounttype) VALUES (?, ?, ?);', [userName, passwordHash, accountType], function(err, rows, fields) {
        if (err) {
          if (err.code == 'ER_DUP_ENTRY') {
            // Username already exists in database
            res.status(400); // 400 Bad Request
            res.json({
              'message': 'User already exists'
            });
          } else {
            // Something else went wrong
            // Fail safely when error occurs
            console.log(err);
            res.status(500); // Internal Server error
            res.json({
              'message': 'Internal server error'
            });
          }
        } else {
          // Insertion into DB was successful
          console.log('Inserted ', userName)
          res.json({
            'message': 'User created'
          });
        }
      });
    }
  });
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
