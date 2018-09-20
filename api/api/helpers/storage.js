var connection = require('../helpers/db').connection;

module.exports.getDocumentList = function () {
    return new Promise(function (fulfill, reject) {
        connection.query(`SELECT
            d.id, users.userName, d.name, d.description, d.filesize, d.timestamp
            FROM documents AS d
            JOIN users ON d.uploaderID = users.id`, [], function (err, rows, fields) {
            if (err) {
                // Something went wrong
                console.log(`Error loading document list: ${err}`);
                reject(err);
            } else {
                if (rows != undefined && rows.length > 0) {
                    console.log(rows);
                    fulfill(rows);
                } else {
                    reject({
                        code: 404,
                        message: `No files in database`
                    })
                }
            }
        })
    });
}

module.exports.storeDocument = function (uploaderID, filename, filetype, filesize, description, binary) {
    return new Promise(function (fulfill, reject) {
        connection.query('INSERT INTO documents SET ?', {
            'uploaderID': uploaderID,
            'name': filename,
            'description': description,
            'filesize': filesize,
            'filetype': filetype,
            'filedata': binary
        }, function (err, rows, fields) {
            if (err) {
                // Something went wrong
                console.log(`Error inserting into table documents: ${err}`);
                reject(err);
            } else {
                // Insertion into DB was successful
                console.log(`Stored document in DB`)
                fulfill(true);
            }
        })
    });
}

module.exports.loadDocument = function (fileID) {
    return new Promise(function (fulfill, reject) {
        connection.query('SELECT * FROM documents WHERE id=?', [fileID], function (err, rows, fields) {
            if (err) {
                // Something went wrong
                console.log(`Error loading document (ID: ${fileID}) ${err}`);
                reject(err);
            } else {
                if (rows != undefined && rows.length > 0) {
                    console.log(rows[0]);
                    fulfill(rows[0]);
                } else {
                    reject({
                        code: 404,
                        message: `File with ID ${fileID} not found`
                    })
                }

            }
        })
    });
}


module.exports.deleteDocument = function (fileID) {
    return new Promise(function (fulfill, reject) {
        connection.query('DELETE FROM documents WHERE id=?', [fileID], function (err, rows, fields) {
            if (err) {
                // Something went wrong
                console.log(`Error deleting document (ID: ${fileID}) ${err}`);
                reject(err);
            }

            if (rows.affectedRows == 0) {
                reject({
                    'code': 400,
                    'message': 'no document deleted. Perhaps wrong ID?'
                })
            }

            console.log(`Deleted File with ID ${fileID}`);
            fulfill(true);
        })
    })
}