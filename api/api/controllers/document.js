'use strict';

var path = require('path');
var auth = require('../helpers/auth');
var error = require('../helpers/error');
var [dbURL, privateKey, publicKey] = require('../helpers/setupEnv').init()

module.exports = {
  downloadDocument: downloadDocument,
  uploadDocument: uploadDocument
};

function downloadDocument(req, res) {
  var token = req.swagger.params.token.value;

  // Send file
  auth.verifyToken(publicKey, token)
    .then(function() {
      // To demonstrate send this script itself
      // TODO: Send useful stuff
      var filename = "document.js";
      var fullPath = path.join(__dirname, filename);
      res.set({
        "Content-Disposition": 'attachment; filename="' + filename + '"',
      });
      res.sendFile(fullPath);
    })
    .catch(function(err) {
      error.sendMsg(res, err)
    })
}

function uploadDocument(req, res) {
  var token = req.swagger.params.token.value;
  var file = req.swagger.params.file.value;

  auth.verifyToken(publicKey, token)
    .then(function() {
      console.log(`Filename: ${file.originalname}`)
      console.log(file.buffer.toString('utf8'))
      res.send({
        message: 'successful upload'
      })
    })
    .catch(function(err) {
      error.sendMsg(res, err)
    })
}
