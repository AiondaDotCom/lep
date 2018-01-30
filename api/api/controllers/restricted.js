'use strict';

var util = require('util');
var jwt = require('jsonwebtoken');

var auth = require('./auth');
var error = require('../helpers/error');

var dbURL = process.env.JAWSDB_URL;
var privateKey = process.env.DEVEL_PRIVATE_KEY;
var publicKey = process.env.DEVEL_PUBLIC_KEY;
if (!dbURL) {
  throw new Error('ENV VAR "JAWSDB_URL" missing');
}
if (!privateKey) {
  throw new Error('ENV VAR "DEVEL_PRIVATE_KEY" missing');
}
if (!publicKey) {
  throw new Error('ENV VAR "DEVEL_PUBLIC_KEY" missing');
}

module.exports = {
  restricted: restricted
};

function restricted(req, res) {
  var token = req.swagger.params.jwt.value;
  console.log("Verifying token: ", token)

  auth.verifyToken(publicKey, token)
    .then(function(){
      res.json('Access granted!')
    })
    .catch(function(err){
      error.sendMsg(res, err);
    })
}
