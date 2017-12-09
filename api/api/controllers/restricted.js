'use strict';

var util = require('util');
var jwt = require('jsonwebtoken');


var dbURL = process.env.JAWSDB_URL;
var privateKey = process.env.DEVEL_PRIVATE_KEY;
var publicKey = process.env.DEVEL_PUBLIC_KEY;
if (!dbURL){throw new Error('ENV VAR "JAWSDB_URL" missing');}
if (!privateKey){throw new Error('ENV VAR "DEVEL_PRIVATE_KEY" missing');}
if (!publicKey){throw new Error('ENV VAR "DEVEL_PUBLIC_KEY" missing');}


module.exports = {
  restricted: restricted
};

function restricted(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var token     = req.swagger.params.jwt.value;
  console.log("Verifying token: ", token)

  jwt.verify(token, publicKey, function(err, decoded) {
    if (err){
      console.log(err)
      res.status(401); // 401 Unauthorized
      res.json('ERROR: Verification failed')
    }
    else {
      console.log(decoded)
      res.json('Access granted!')
    }
    //console.log(decoded.foo) // bar
    });

    //res.json('ERROR: Access denied')
  }
