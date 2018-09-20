'use strict';

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason.stack);
  // application specific logging, throwing an error, or other logic here
});

var SwaggerExpress = require('swagger-express-mw');
var express = require('express');
var app = require('express')();
var spa = require('./spa'); //require('express-spa')
var fs = require('fs');
var db = require('./api/helpers/db');
var auth = require('./api/helpers/auth');
var helper = require('./api/helpers/helper');
var settings = require('./api/helpers/settings');
var morgan = require('morgan')
var startup = require('./api/helpers/startupMessages');

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

// Do DB sanity Check
//db.healthCheck();

// Gebe die wichtigsten Konfigurationsdaten auf Konsole aus
startup.startupMessages();

console.log('Importing domainWhitelist from env');
settings.getDomainWhitelist()
  .then((rows) => {
    if (rows.length == 0) {
      // only import whitelist if empty
      return settings.importWhitelistFomEnv();
    } else {
      console.log('domainWhitelist not empty -> not importing env...');
    }
  })
  .then(() => {
    console.log('import domainWhitelist successful')
  })
  .catch((err) => {
    console.log(`Error importing domainWhitelist: ${err}`);
  })

// Create setup token
// TODO: Only output token, when in setup mode
let expire = helper.now() + 30 * 60 * 60; // Expire in 30 minutes
let payload = {
  action: 'setup',
  username: 'setup',
  accountType: 'setup'
}
auth.generateToken(expire, payload)
  .then((token) => {
    console.log(`>>\n>>SETUP TOKEN: ${token}\n>>`);
  })
  .catch((err) => {
    // Something went very wrong
    throw err;
  })

// Register custom middleware that redirects http requests to https
app.use(function (req, res, next) {
  if (process.env.BEHIND_PROXY) {
    // Get the protocol that the client unsed to connect to Heroku
    var protocol = req.header('X-Forwarded-Proto');
    if (protocol == 'http') {
      console.log('Redirecting http->https')
      return res.redirect(302, 'https://' + process.env.SERVER_NAME + req.url)
    }
  }
  next()
})

app.use('/', express.static('spa'));
app.use(spa('spa/index.html'))

if (process.env.BEHIND_PROXY)
  app.enable('trust proxy');

app.use(morgan('combined'))


SwaggerExpress.create(config, function (err, swaggerExpress) {
  if (err) {
    throw err;
  }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 80;
  fs.openSync('/tmp/app-initialized', 'w');

  console.log('LISTENING ON PORT: ', port);
  app.listen(port);
});