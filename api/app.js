'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var fs = require('fs');

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);
  
  //var port = process.env.PORT || 10010;
  var port = 4242;
  fs.openSync('/tmp/app-initialized', 'w');

  console.log('LISTENING ON PORT: ', port);
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
