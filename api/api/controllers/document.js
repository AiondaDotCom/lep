'use strict';

var path = require('path');
var auth = require('../helpers/auth');
var error = require('../helpers/error');
var storage = require('../helpers/storage');

module.exports = {
  getDocumentList: getDocumentList,
  downloadDocument: downloadDocument,
  uploadDocument: uploadDocument,
  deleteDocument: deleteDocument
};


function getDocumentList(req, res) {
  var token = req.swagger.params.token.value;

  auth.verifyToken(token)
    .then(function (payload) {
      return auth.isAdmin(payload)
    })
    .then(() => {
      return storage.getDocumentList()
    })
    .then((documents) => {
      res.send(documents)
    })
    .catch(function (err) {
      error.sendMsg(res, err)
    })
}

function downloadDocument(req, res) {
  var token = req.swagger.params.token.value;
  var fileID = req.swagger.params.fileID.value;

  // Send file
  auth.verifyToken(token)
    .then(function () {
      // To demonstrate send this script itself
      // TODO: Send useful stuff
      //var filename = "document.js";
      //var fullPath = path.join(__dirname, filename);
      return storage.loadDocument(fileID)
    })
    .then((file) => {
      // https://stackoverflow.com/questions/34391134/send-a-binary-buffer-to-client-through-http-serverresponse-in-node-js#34392022
      var filename = file.name;
      var data = file.filedata;

      res.set({
        "Content-Disposition": 'attachment; filename="' + filename + '"',
        "Content-Type": file.filetype,
        "Content-Length": file.filesize
      });
      //res.sendFile(fullPath);

      res.write(new Buffer(data, 'binary'));
      res.end(null, 'binary');
    })
    .catch(function (err) {
      error.sendMsg(res, err)
    })
}

function uploadDocument(req, res) {
  var token = req.swagger.params.token.value;
  var file = req.swagger.params.file.value;
  var description = req.swagger.params.description.value;
  var filename = file.originalname;
  var filetype = file.mimetype;
  var filesize = file.buffer.length;
  var filebuffer = file.buffer;

  auth.verifyToken(token)
    .then(function (tokenPayload) {
      var uploaderID = tokenPayload.userID;

      return new Promise(function (fulfill, reject) {
          if (filesize > 5 * 1024 * 1024) { // TODO: Use ENV Var for maximum filesize
            console.log(`User ${uploaderID} tried to upload file '${filename}' (size: ${filesize})`)
            reject({
              code: 400,
              message: 'Filesize too large (>5MB)'
            })
          } else {
            fulfill(true)
          }
        })
        .then(() => {
          console.log(`User ${uploaderID} uploads file '${filename}' (size: ${filesize})`)
          return storage.storeDocument(uploaderID, filename, filetype, filesize, description, filebuffer)
        })
    })
    .then((result) => {
      res.send({
        message: 'successful upload'
      })
    })
    .catch(function (err) {
      error.sendMsg(res, err)
    })
}


function deleteDocument(req, res) {
  /*
   * Nutzer dürfen die von ihnen selbst hochgeladenen Dokumente löschen
   * Admins und Moderatoren dürfen alle Dokumente löschen
   */
  var token = req.swagger.params.token.value;
  var documentID = req.swagger.params.documentID.value;

  auth.verifyToken(token)
    .then(function (payload) {
      // TODO: Erlaube Nutzern und Moderatoren das Löschen der von ihnen selbst hochgeladenen Dokumente
      return auth.isAdmin(payload)
    })
    .then(() => {
      return storage.deleteDocument(documentID)
    })
    .then((documents) => {
      res.send({
        'message': `Deleted document with ID ${documentID}`
      })
    })
    .catch(function (err) {
      error.sendMsg(res, err)
    })
}