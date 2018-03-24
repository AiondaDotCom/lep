'use strict';

var auth = require('../helpers/auth');
var error = require('../helpers/error');
var connection = require('../helpers/db').connection;

module.exports = {
  restricted: restricted
};

function restricted(req, res) {
  var token = req.swagger.params.jwt.value;
  console.log("Verifying token: ", token)

  auth.verifyToken(token)
    .then(function(){
      res.json({message: 'Access granted!'})
    })
    .catch(function(err){
      error.sendMsg(res, err);
    })
}
