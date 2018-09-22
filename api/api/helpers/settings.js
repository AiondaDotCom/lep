var connection = require('../helpers/db').connection;
var [dbURL, privateKey, publicKey, saltRounds] = require('../helpers/setupEnv').init()
var domainWhitelist = require('../../police_domain_names.json').DE;

module.exports.importWhitelistFomEnv = function () {
  let promisList = [];
  for (let domain of domainWhitelist) {
    promisList.push(module.exports.addDomainToWhitelist(domain));
  }
  return Promise.all(promisList);
}


module.exports.isDomainInWhitelist = function (domain) {
  return new Promise(function (fulfill, reject) {
    connection.query('SELECT * FROM domainWhitelist WHERE domain = ?', [domain], function (err, rows, fields) {
      if (err) {
        reject(err);
      }
      if (rows.length > 0) {
        fulfill(true);
      } else {
        fulfill(false);
      }
    })
  })
}

module.exports.getDomainWhitelist = function (domain) {
  return new Promise(function (fulfill, reject) {
    connection.query('SELECT * FROM domainWhitelist ORDER BY domain', function (err, rows, fields) {
      if (err) {
        reject(err);
      }
      if (rows != undefined) {
        let whitelist = [];
        for (let row of rows) {
          whitelist.push(row.domain);
        }
        fulfill(whitelist);
      } else {
        // Username is not in DB
        fulfill([]);
      }
    })
  })
}

module.exports.addDomainToWhitelist = function (domain) {
  return new Promise(function (fulfill, reject) {
    connection.query('INSERT INTO domainWhitelist SET ?', {
      'domain': domain
    }, function (err, rows, fields) {
      if (err) {
        if (err.code == 'ER_DUP_ENTRY') {
          // Domain already exists in database
          reject({
            code: 400, // Bad Request
            message: `Cannot add domain to whitelist. (Duplicate)`
          })
        } else {
          reject(err);
        }
      } else {
        // Insertion into DB was successful
        console.log(`Inserted domain ${domain} into whitelist`)
        fulfill(true);
      }
    });
  })
}

module.exports.removeDomainFromWhitelist = function (domain) {
  return new Promise(function (fulfill, reject) {
    connection.query('DELETE FROM domainWhitelist WHERE domain = ?', [domain], function (err, rows, fields) {
      if (err) {
        if (err.code == 'ER_DUP_ENTRY') {
          // Domain already exists in database
          reject({
            code: 400,
            message: `ERR: Tried to insert duplicate domain: ${domain}`
          });
        } else {
          reject(err);
        }
      }
      fulfill();
    })
  })
}


module.exports.getSettingsValue = function (settingsKey) {
  return new Promise(function (fulfill, reject) {
    connection.query('SELECT * FROM settings WHERE settingsKey = ?', [settingsKey], function (err, rows, fields) {
      if (err) {
        reject(err);
      }
      if (rows != undefined && rows[0] != undefined) {
        fulfill(rows[0].settingsValue);
      } else {
        reject({
          code: 404,
          message: `Key ${settingsKey} not in settings table`
        })
      }
    })
  })
}