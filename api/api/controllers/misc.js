'use strict';

var error = require('../helpers/error');
var auth = require('../helpers/auth');
var connection = require('../helpers/db')

module.exports = {
  status: status,
  getDomainWhitelist: getDomainWhitelist,
  whatIsMyIP: whatIsMyIP
};

function status(req, res) {
  // TODO: Reaturn correct information
  res.json({
    message: 'Status: OK',
    healthy: true,
    production: false,
    setupMode: true
  })
}

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
