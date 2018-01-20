'use strict';

var util = require('util');
var mysql = require('mysql'); // Database connection
var jwt = require('jsonwebtoken'); // Generate and verify jwts
var bcrypt = require('bcrypt'); // Hash passwords

var mail = require('../helpers/mail');

var domainWhitelist = require('../../../assets/police_domain_names.json').DE;

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

function logInteraction(username, action, error, description) {
  // This function is used to create a protocol of user interactions
  return new Promise(function(fulfill, reject) {
    connection.query('INSERT INTO loginLog SET ?', {
      'username': username,
      'action': action,
      'error': error,
      'description': description
    }, function(err, rows, fields) {
      if (err) {
        // Something went wrong
        console.log(`Error inserting into table loginLog: ${err}`);
        reject(err);
      } else {
        // Insertion into DB was successful
        console.log(`Inserted interaction: ${username}, ${action}, ${description}`)
        fulfill(true);
      }
    });
  })
}

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
      // TODO: Check if accountstate=='active'

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

                  connection.query('SELECT * FROM loginLog WHERE username=? AND action=? AND error=? ORDER BY timestamp DESC LIMIT ?', [userName, false, 'login', 1], function(err, rows, fields) {
                    if (err) {
                      console.log(err);
                      res.json({
                        'jwt': token,
                        'userName': userName,
                        'expireTimestamp': expireTimestamp,
                        'accountType': accountType,
                        'lastLogin': false
                      });
                    } else {
                      logInteraction(userName, 'login', false, 'Successful login');
                      console.log(rows);
                      var lastLoginTimestamp = false;
                      if (rows.length > 0) {
                        var lastLoginTimestamp = rows[0].timestamp;
                      }
                      res.json({
                        'jwt': token,
                        'userName': userName,
                        'expireTimestamp': expireTimestamp,
                        'accountType': accountType,
                        'lastLogin': lastLoginTimestamp
                      });
                    }
                  })
                }
              })
          } else {
            // Password is invalid
            logInteraction(userName, 'login', true, 'Attempted login with wrong password')
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
  var domain = email.substring(email.lastIndexOf("@") + 1);

  console.log('registration for adress ' + email + ' was requested.');

  if (domainWhitelist.includes(domain)) {
    // Domain is whitelisted

    console.log('Generating invitation link and sending mail...')

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
          console.log(`ERR: Tried to create duplicate user: ${email}`)
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
        // Everything is ok, Generate TOKEN
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
              res.json('registration mail sent');

              let bodyText = `To complete your registration please visit:\nhttps://aionda-lep.herokuapp.com/register?email=${email}&token=${token}`;
              let bodyHtml = `To complete your registration please visit:
          <a href="https://aionda-lep.herokuapp.com/register?email=${email}&token=${token}">Finish registration</a>`;

              mail.send(email, 'register@aionda-lep.herokuapp.com', 'Confirm your registration', bodyText, bodyHtml)

            }
          })
      }
    })
  } else {
    // Domain is not whitelisted
    console.log(`ERR: Tried to register with not whitelisted email: ${email}`)
    res.status(400); // 400 Bad Request
    res.json({
      'message': `Email adress '${email}' is not whitelisted`
    });
  }
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
          // Password was hashed successfully, update user information
          // TODO: Prevent user from updating multiple times (verify if accountstate is 'registration_pending')
          connection.query('UPDATE users SET ? WHERE username=?', [{
            password: passwordHash,
            accounttype: accountType,
            realname: fullName,
            accountstate: 'active'
          }, decoded.email], function(err, rows, fields) {
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
    } else {
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
