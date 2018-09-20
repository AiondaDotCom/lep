'use strict';

var error = require('../helpers/error');
var auth = require('../helpers/auth');
var db = require('../helpers/db');
var settings = require('../helpers/settings');
var connection = db.connection;

module.exports = {
  status: status,
  getDomainWhitelist: getDomainWhitelist,
  whatIsMyIP: whatIsMyIP,
  getDatabaseID: getDatabaseID
};

function status(req, res) {
  // TODO: Reaturn correct information
  db.healthCheck();
  res.json({
    message: 'Status: OK',
    healthy: true,
    production: false,
    setupMode: true
  })
}

function getDomainWhitelist(req, res) {
  // No protection of this endpoint
  //let whitelist = auth.getDomainWhitelist();
  settings.getDomainWhitelist()
    .then((whitelist) => {
      res.json(whitelist);
    })
    .catch(function (err) {
      error.sendMsg(res, err)
    })
}

function whatIsMyIP(req, res) {
  // Try to get the ip adress
  var ip = req.ip

  res.json({
    ip: ip
  })
}


function getDatabaseID(req, res) {
  // Returns the settings keys and values stored in settings table
  settings.getSettingsValue('databaseID')
    .then((databaseID) => {
      res.json({
        databaseID
      })
    })
    .catch((err) => {
      error.sendMsg(res, err)
    })
}