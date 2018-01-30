module.exports.logInteraction = function(connection, username, action, error, description) {
  // This function is used to create a protocol of user interactions
  return new Promise(function(fulfill, reject) {
    connection.query('INSERT INTO loginLog SET ?', {
      'username': username,
      'action': action,
      'error': error,
      'description': description
    }, function(err, rows, fields) {
      if (err) {
        // Something went wrong
        console.log(`Error inserting into table loginLog: ${err}`);
        reject(err);
      } else {
        // Insertion into DB was successful
        console.log(`Inserted interaction: ${username}, ${action}, ${description}`)
        fulfill(true);
      }
    });
  })
}


module.exports.getLastLoginTimestamp = function(connection, username) {
  // Returns the last successful login timestamp
  return new Promise(function(fulfill, reject) {
    connection.query('SELECT * FROM loginLog WHERE username=? AND action=? AND error=? ORDER BY timestamp DESC LIMIT ?', [username, 'login', false, 1], function(err, rows, fields) {
      if (err) {
        reject(err);
      } else {
        if (rows.length > 0) {
          var lastLoginTimestamp = rows[0].timestamp;
        } else {
          var lastLoginTimestamp = 0;
        }
        fulfill(lastLoginTimestamp)
      }
    })
  })
}
