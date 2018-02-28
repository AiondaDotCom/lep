var jwt = require('jsonwebtoken'); // Generate and verify jwts
var bcrypt = require('bcrypt'); // Hash passwords
var connection = require('../helpers/db');
var [dbURL, privateKey, publicKey, saltRounds] = require('../helpers/setupEnv').init()
var domainWhitelist = require('../../../assets/police_domain_names.json').DE;

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

module.exports.getUserList = function() {
  // Query database for given username
  return new Promise(function(fulfill, reject) {
    connection.query('SELECT * FROM users', function(err, rows, fields) {
      if (err) {
        reject(err);
      }
      var accountList = [];
      for (let row of rows) {
        accountList.push({
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

module.exports.getDomainWhitelist = function() {
  return domainWhitelist;
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

module.exports.verifyPayload = function(payload){
  console.log(payload)
  return new Promise(function(fulfill, reject){
    if (typeof payload.username !== 'undefined' &&
        typeof payload.accountType != 'undefined'// &&
        //typeof payload.maxExpireTimestamp != 'undefined' &&
        //typeof payload.nRenew != 'undefined'
      ){
      fulfill(payload);
    }
    else {
      reject({
        code: 401,
        message: 'Token invalid (invalid payload)'
      })
    }
  })
}

module.exports.verifyToken = function(token) {
  return new Promise(function(fulfill, reject) {
    jwt.verify(token, publicKey, function(err, decoded) {
      if (err) {
        var myMessage = '';
        if (err.message){
          myMessage = `Token invalid (${err.message})`
        }
        else {
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
  .then(function(payload){
    return module.exports.verifyPayload(payload)
  })
}


module.exports.isAdmin = function(tokenPayload) {
  return new Promise(function(fulfill, reject) {
    if (tokenPayload.accountType == 'admin') {
      fulfill(true)
    }
    reject({
      code: 401, // Unauthorized
      message: 'Account is not admin'
    });
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



module.exports.createAccount = function(email, fullName, password, accountType) {
  // Warning: Authentication has to be done before calling this function!
  return module.exports.hashPassword(password, saltRounds)
    .then(function(passwordHash) {
      // Password was hashed successfully, update user information
      // TODO: Prevent user from updating multiple times (verify if accountstate is 'registration_pending')
      return new Promise(function(fulfill, reject) {
        connection.query('UPDATE users SET ? WHERE username=?', [{
          password: passwordHash,
          accounttype: accountType,
          realname: fullName,
          accountstate: 'active'
        },email], function(err, rows, fields) {
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
