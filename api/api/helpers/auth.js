var jwt = require('jsonwebtoken'); // Generate and verify jwts
var bcrypt = require('bcryptjs'); // Hash passwords
var connection = require('../helpers/db').connection;
var [dbURL, privateKey, publicKey, saltRounds] = require('../helpers/setupEnv').init();
var settings = require('../helpers/settings');
var domainWhitelist = require('../../police_domain_names.json').DE;

module.exports.findUserInDB = function (username, accountState) {
  // Query database for given username
  return new Promise(function (fulfill, reject) {
    connection.query('SELECT * FROM users WHERE username=? AND accountstate=?', [username, accountState], function (err, rows, fields) {
      if (err) {
        reject(err);
      }
      console.log(rows);
      if (rows.length > 0) {
        // An entry for the given username was fond in the DB
        fulfill(rows[0]);
      } else {
        // Username is not in DB
        reject({
          code: 401, // Unauthorized
          message: 'Wrong username or password. Access denied!'
        })
      }
    })
  })
}

module.exports.getUserList = function () {
  // Query database for given username
  return new Promise(function (fulfill, reject) {
    connection.query('SELECT * FROM users', function (err, rows, fields) {
      if (err) {
        reject(err);
      }
      var accountList = [];
      for (let row of rows) {
        accountList.push({
          userID: row.id,
          username: row.username,
          realname: row.realname,
          accounttype: row.accounttype,
          accountstate: row.accountstate
        })
      }
      fulfill(accountList);
    })
  })
}


module.exports.checkEmailWhitelist = function (emailadress) {
  var domain = emailadress.substring(emailadress.lastIndexOf("@") + 1);
  return new Promise(function (fulfill, reject) {
    settings.isDomainInWhitelist(domain)
      .then((result) => {
        if (result) {
          fulfill();
        } else {
          reject({
            code: 400, // 400 Bad Request
            message: `Email adress '${emailadress}' is not whitelisted`
          });
        }
      })
  })
}

module.exports.generateToken = function (expireTimestamp, payload) {
  return new Promise(function (fulfill, reject) {
    payload['exp'] = expireTimestamp;

    jwt.sign(payload,
      privateKey, {
        algorithm: 'RS256'
      },
      function (err, token) {
        if (err) {
          // Something went wrong during signing
          reject(err)
        } else {
          // Signing was successful, return the token
          fulfill(token);
        }
      })
  })
}

module.exports.verifyPayload = function (payload) {
  console.log(payload)
  return new Promise(function (fulfill, reject) {
    if (typeof payload.username !== 'undefined' &&
      typeof payload.accountType != 'undefined' // &&
      //typeof payload.maxExpireTimestamp != 'undefined' &&
      //typeof payload.nRenew != 'undefined'
    ) {
      fulfill(payload);
    } else {
      reject({
        code: 401,
        message: 'Token invalid (invalid payload)'
      })
    }
  })
}

module.exports.verifyToken = function (token) {
  return new Promise(function (fulfill, reject) {
      jwt.verify(token, publicKey, function (err, decoded) {
        if (err) {
          var myMessage = '';
          if (err.message) {
            myMessage = `Token invalid (${err.message})`
          } else {
            myMessage = `Token invalid`
          }
          reject({
            code: 401,
            message: myMessage
          });
        }
        fulfill(decoded) // Return payload
      })
    })
    .then(function (payload) {
      return module.exports.verifyPayload(payload)
    })
}

module.exports.verifyTokenAction = function (tokenPayload, tokenAction) {
  return new Promise(function (fulfill, reject) {
    if (tokenPayload.action && tokenPayload.action == tokenAction) {
      fulfill(true)
    } else {
      reject({
        code: 401,
        message: `Token was not issued for this action (action=${tokenPayload.action})`
      })
    }
  })
}


module.exports.isAdmin = function (tokenPayload) {
  return new Promise(function (fulfill, reject) {
    if (tokenPayload.accountType == 'admin') {
      fulfill(true)
    }
    reject({
      code: 401, // Unauthorized
      message: 'Account is not admin'
    });
  })
}

module.exports.hashPassword = function (password, saltRounds) {
  return new Promise(function (fulfill, reject) {
    bcrypt.hash(password, saltRounds, function (err, passwordHash) {
      if (err) {
        reject(err);
      }
      fulfill(passwordHash);
    })
  })
}

module.exports.verifyPassword = function (password, passwordHash) {
  console.log('VERIFY PASSWORD')
  return new Promise(function (fulfill, reject) {
    bcrypt.compare(password, passwordHash, function (err, authRes) {
      console.log('POST COMPARE')
      if (err) {
        reject(err);
      }
      if (authRes) {
        // Password correct
        fulfill(true);
      } else {
        // Password wrong
        reject({
          code: 401,
          message: 'Wrong username or password. Access denied!'
        });
      }
    })
  })
}



module.exports.createAccount = function (email, fullName, password, accountType) {
  // Warning: Authentication has to be done before calling this function!
  return module.exports.hashPassword(password, saltRounds)
    .then(function (passwordHash) {
      // Password was hashed successfully, update user information
      // TODO: Prevent user from updating multiple times (verify if accountstate is 'registration_pending')
      return new Promise(function (fulfill, reject) {
        connection.query('UPDATE users SET ? WHERE username=?', [{
          password: passwordHash,
          accounttype: accountType,
          realname: fullName,
          accountstate: 'active'
        }, email], function (err, rows, fields) {
          if (err) {
            // Username already exists in database
            if (err.code == 'ER_DUP_ENTRY') {
              reject({
                code: 400,
                message: `User ${email} already exists`
              })
            } else {
              reject(err)
            }
          }

          // Insertion into DB was successful
          console.log(`Inserted ${email}`)

          fulfill();
        });
      })
    })
}


module.exports.createUser = function (email, fullName, password, accountType, accountState) {
  return module.exports.hashPassword(password, saltRounds)
    .then(function (passwordHash) {
      return new Promise(function (fulfill, reject) {
        connection.query('INSERT INTO users SET ?', [{
          username: email,
          password: passwordHash,
          accounttype: accountType,
          realname: fullName,
          accountstate: accountState
        }, email], function (err, rows, fields) {
          if (err) {
            // Username already exists in database
            if (err.code == 'ER_DUP_ENTRY') {
              reject({
                code: 400,
                message: `User ${email} already exists`
              })
            } else {
              reject(err)
            }
          }
          // Insertion into DB was successful
          console.log(`Inserted ${email}`)
          fulfill();
        });
      })
    })
}


module.exports.deleteAccount = function (deleteID) {
  return new Promise(function (fulfill, reject) {
    connection.query('DELETE FROM users WHERE id=?', [deleteID], function (err, rows, fields) {
      if (err) {
        // Something went wrong
        console.log(`Error deleting user (ID: ${fileID}) ${err}`);
        reject(err);
      }

      if (rows.affectedRows == 0) {
        reject({
          'code': 400,
          'message': `User with ID ${deleteID} not in database`
        })
      }

      console.log(`Deleted user with ID ${deleteID}`);
      fulfill(true);
    })
  })
}