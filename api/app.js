'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var fs = require('fs');
var db = require('./api/helpers/db');
var auth = require('./api/helpers/auth');
var helper = require('./api/helpers/helper');
var settings = require('./api/helpers/settings');

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

// Do DB sanity Check
//db.healthCheck();


console.log('Importing domainWhitelist from env');
settings.getDomainWhitelist()
  .then((rows)=>{
    if (rows.length == 0){
      // only import whitelist if empty
      return settings.importWhitelistFomEnv();
    }
    else {
      console.log('domainWhitelist not empty -> not importing env...');
    }
  })
  .then(()=>{
    console.log('import domainWhitelist successful')
  })
  .catch((err)=>{
    console.log(`Error importing domainWhitelist: ${err}`);
  })

// Create setup token
// TODO: Only output token, when in setup mode
let expire = helper.now() + 30*60*60; // Expire in 30 minutes
let payload = {
  action: 'setup',
  username: 'setup',
  accountType: 'setup'
}
auth.generateToken(expire, payload)
  .then((token)=>{
    console.log(`>>\n>>SETUP TOKEN: ${token}\n>>`);
  })
  .catch((err)=>{
    // Something went very wrong
    throw err;
  })

// Register custom middleware
app.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  //var port = process.env.PORT || 10010;
  // Use fixed port
  var port = 4242;
  fs.openSync('/tmp/app-initialized', 'w');

  console.log('LISTENING ON PORT: ', port);
  app.listen(port);
});
