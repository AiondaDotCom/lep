'use strict';

var error = require('../helpers/error');
var auth = require('../helpers/auth');
var connection = require('../helpers/db')

module.exports = {
  getDomainWhitelist: getDomainWhitelist
};

function getDomainWhitelist(req, res) {
  // No protection of this endpoint
  let whitelist = auth.getDomainWhitelist();
  res.json(whitelist);
}
