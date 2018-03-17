'use strict';

var error = require('../helpers/error');
var auth = require('../helpers/auth');
var connection = require('../helpers/db')

module.exports = {
  getDomainWhitelist: getDomainWhitelist,
  whatIsMyIP: whatIsMyIP
};

function getDomainWhitelist(req, res) {
  // No protection of this endpoint
  let whitelist = auth.getDomainWhitelist();
  res.json(whitelist);
}

function whatIsMyIP(req, res) {
  // Returns the ip adress of the client
  var ip = req.headers['x-forwarded-for'];
  res.json({
    ip: ip
  })
}
