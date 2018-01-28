var jwt = require('jsonwebtoken'); // Generate and verify jwts
var bcrypt = require('bcrypt'); // Hash passwords


module.exports.generateToken = function(privateKey, accountType, expireTimestamp) {
  console.log('HELL YEAY\n\n\n')
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
          message: 'Wrong username or password'
        });
      }
    })
  })
}
