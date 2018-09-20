var hlp = require('./helper');
var db = require('./db');
var [mysqlConfig, privateKey, publicKey] = require('../helpers/setupEnv').init()

module.exports.startupMessages = () => {
  hlp.header('JWT CONFIG');
  console.log(`
> PRIVATE_KEY
${privateKey}

> PUBLIC_KEY
${publicKey}
`)

  hlp.header('MYSQL_CONFIG');
  console.dir(mysqlConfig);

  db.getMYSQLConnectionCipher()
    .then((cipher) => {
      hlp.header('SSL-CONFIG')

      console.log('Ssl_cipher: ' + cipher)
      if (cipher == 'DHE-RSA-AES256-SHA') {
        console.log('Connection uses SSL')
      } else {
        console.log('WARNING: CONNECTION WITHOUT SSL')
      }
    })
    .catch((err) => {
      console.log(`Error fetching mysql cipher: ${err}`)
    })

  db.getMaxAllowedPacketSize().then((maxPacketSize) => {
    hlp.header('max_allowed_packet');
    console.log(`max_allowed_packet: ${maxPacketSize} (${(maxPacketSize/1024/1024).toFixed(1)}MB)`);
  })
}