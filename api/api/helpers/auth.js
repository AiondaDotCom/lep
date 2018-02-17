var jwt = require('jsonwebtoken'); // Generate and verify jwts
var bcrypt = require('bcrypt'); // Hash passwords
var connection = require('../helpers/db');
var [dbURL, privateKey, publicKey] = require('../helpers/setupEnv').init()

module.exports.findUserInDB = function(username) {
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

module.exports.checkEmailWhitelist = function(emailadress) {
  return new Promise(function(fulfill, reject) {
    var domain = emailadress.substring(emailadress.lastIndexOf("@") + 1);
    if (domainWhitelist.includes(domain)) {
      fulfill();
    } else {
      reject({
        code: 400, // 400 Bad Request
        message: `Email adress '${emailadress}' is not whitelisted`
      });
    }
  })
}

module.exports.generateToken = function(expireTimestamp, payload) {
  return new Promise(function(fulfill, reject) {
    payload['exp'] = expireTimestamp;

    jwt.sign(payload,
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
    jwt.verify(token, publicKey, function(err, decoded) {
      if (err) {
        reject({
          code: 401,
          message: 'Token invalid'
        });
      }
      fulfill(decoded) // Return payload
    })
  })
}

module.exports.hashPassword = function(password, saltRounds) {
  return new Promise(function(fulfill, reject) {
    bcrypt.hash(password, saltRounds, function(err, passwordHash) {
      if (err) {
        reject(err);
      }
      fulfill(passwordHash);
    })
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
