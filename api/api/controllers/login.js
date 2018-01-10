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
  register: register,
  requestRegistration: requestRegistration,
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
            var accountType = rows[0]['accounttype'];
            jwt.sign({
                type: accountType,
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
                    'expireTimestamp': expireTimestamp,
                    'accountType': accountType
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

function requestRegistration(req, res) {
  // Sends an "invitiaion"-link to the provided mailadress
  // TODO: potentially protect this endpoint via captcha
  var email = req.swagger.params.email.value;

  console.log('registration for adress ' + email + ' was requested.');
  console.log('Generating invitation link and sending mail...')

  // TODO: check if email has already a account

  // Generate TOKEN
  var expiresInNSeconds = 24 * 60 * 60; // Expires in 24 hours
  var expireTimestamp = Math.floor(Date.now() / 1000) + expiresInNSeconds;
  jwt.sign({
      type: 'user',
      action: 'registration',
      exp: expireTimestamp,
      email: email
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
        // Signing was successful
        // TODO send the token via Mail
        console.log(token);
        console.log(`
  To complete your registration please visit:
    http://localhost:4200/register?email=${email}&token=${token}
`);
        res.json('regitration mail sent');
      }
    })
}

function register(req, res) {
  var fullName = req.swagger.params.fullName.value;
  var password = req.swagger.params.password.value;
  var token = req.swagger.params.token.value;
  //var email = req.swagger.params.email.value;

  //var userPassword = req.swagger.params.password.value;

  var accountType = 'user';
  // TODO: decide what accountType to use
  // TODO: check if the username is valid
  //        -> is a valid mailadress
  //        -> domain is listed in police_domain_names.json


  jwt.verify(token, publicKey, function(err, decoded) {
    if (err) {
      console.log(err)
      res.status(401); // 401 Unauthorized
      res.json('ERROR: Verification failed')
    } else if (decoded.action == 'registration') {
      // token is valid for registration
      console.log(decoded)
      bcrypt.hash(password, saltRounds, function(err, passwordHash) {
        if (err) {
          // Problems creating hash of password
          console.log(err);
          res.status(500); // Internal Server error
          res.json({
            'message': 'Internal server error'
          });
        } else {
          // Password was hashed successfully, create new entry in 'users' table
           connection.query('INSERT INTO users (username, password, accounttype) VALUES (?, ?, ?);', [decoded.email, passwordHash, accountType], function(err, rows, fields) {
              if (err) {
                if (err.code == 'ER_DUP_ENTRY') {
                  // Username already exists in database
                  console.log(`ERR: Tried to create duplicate user: ${decoded.email}`)
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
                console.log(`Inserted ${decoded.email}`)
                res.json({
                  'message': `User ${decoded.email} created`
                });
              }
            });
        }
      });
      //res.json('Access granted!')
    }
    else {
      // Token valid, but not assigned for registration
      res.status(401); // 401 Unauthorized
      res.json('ERROR: Verification failed')
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
