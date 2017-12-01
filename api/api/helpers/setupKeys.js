'use strict';

var util = require('util');
var fs = require('fs');

if (fs.existsSync('/srv/.privatekey') && fs.existsSync('/srv/.publickey')) {
  console.log('Using files /srv/.privatekey and /srv/.publickey')
  var privateKey = fs.readFileSync('/srv/.privatekey');
  var publicKey = fs.readFileSync('/srv/.publickey');
}
else if (process.env.DEVEL_PRIVATE_KEY && process.env.DEVEL_PUBLIC_KEY) {
  console.log('Using ENV Vars DEVEL_PRIVATE_KEY and DEVEL_PUBLIC_KEY')
  var privateKey = process.env.DEVEL_PRIVATE_KEY;
  var publicKey = process.env.DEVEL_PUBLIC_KEY;
}
else {
  throw new Error('Keys not set up correctly');
}
//if (!privateKey){throw new Error('ENV VAR "DEVEL_PRIVATE_KEY" missing');}
//if (!publicKey){throw new Error('ENV VAR "DEVEL_PUBLIC_KEY" missing');}
console.log('PRIVATE_KEY ', privateKey);
console.log('PUBLIC_KEY ', publicKey);
