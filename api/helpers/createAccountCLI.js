var mysql = require('mysql');
var inquirer = require('inquirer');
var auth = require('../api/helpers/auth');
var connection = require('../api/helpers/db');
var [dbURL, privateKey, publicKey, saltRounds] = require('../api/helpers/setupEnv').init()


inquirer.prompt([{
    type: 'input',
    name: 'username',
    default: 'admin@admin',
    message: 'Enter username ...'
  },
  {
    type: 'password',
    name: 'password',
    message: 'Enter password ...',
    mask: '*',
    validate: function(value) {
      if (value != '') {
        return true
      } else {
        return "Password must not be empty"
      }
    }
  }
]).then(answers => {
  //console.log(answers)
  var username = answers.username;
  var password = answers.password;

  inquirer.prompt([{
      type: 'password',
      name: 'repeatPassword',
      message: 'Repeat password ...',
      mask: '*',
      validate: function(value) {
        if (value == password) {
          return true
        } else {
          return "Passwords dont match. Please try again"
        }
      }
    },
    {
      type: 'list',
      name: 'accountType',
      choices: ['admin', 'moderator', 'user'],
      message: 'Select accounttype ...'
    }, {
      type: 'input',
      name: 'realname',
      message: 'Enter real name ...'
    }
  ]).then(answers => {
    //console.log(answers)
    auth.hashPassword(password, saltRounds)
    .then(function(passwordHash){
      connection.query('INSERT INTO users SET ?', {
        username: username,
        password: passwordHash,
        accounttype: answers.accountType,
        realname: answers.realname,
        accountstate: 'active'
      }, function(err, rows, fields) {
        if (err) {
          throw err;
        }
        console.log('User inserted!')
      })

      connection.end();
    })
  });
});
