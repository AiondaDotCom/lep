var jwt = require('jsonwebtoken'); // Generate and verify jwts
var bcrypt = require('bcrypt'); // Hash passwords

module.exports.findUserInDB = function(connection, username) {
  // Query database for given username
  return new Promise(function(fulfill, reject) {
    connection.query('SELECT * FROM users WHERE username=?', [username], function(err, rows, fields) {
      if (err) {
        reject(err);
      }
      // TODO: Check if accountstate=='active'
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

module.exports.generateToken = function(privateKey, accountType, expireTimestamp) {
  return new Promise(function(fulfill, reject) {
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
          reject(err)
        } else {
          // Signing was successful, return the token
          fulfill(token);
        }
      })
  })
}


module.exports.verifyToken = function(token) {
  return new Promise(function(fulfill, reject) {

  })
}


module.exports.verifyPassword = function(password, passwordHash) {
  return new Promise(function(fulfill, reject) {
    bcrypt.compare(password, passwordHash, function(err, authRes) {
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
