requirejs.config({
  paths: {
    'jquery': '/node_modules/jquery/dist/jquery.min',
    'popper': '/node_modules/popper.js/dist/umd/popper.min',
    'bootstrap': '/node_modules/bootstrap/dist/js/bootstrap.bundle.min', // Note: The bundle includes Popper.js
    'vue': '/node_modules/vue/dist/vue.min',
    'spin': '/node_modules/ladda-bootstrap/dist/spin.min',
    'ladda': '/node_modules/ladda-bootstrap/dist/ladda.min',
    'timeago': '/node_modules/timeago/jquery.timeago'
  },
  waitSeconds: 20,
  shim: {
    'bootstrap': {
      'deps': ['jquery']
    },
    'ladda': {
      'deps': ['bootstrap', 'spin']
    },
    'timeago': {
      'deps': ['jquery']
    }
  }
})

requirejs(['login']);
//requirejs(["login"], function(login) {
//This function is called when scripts/helper/util.js is loaded.
//If util.js calls define(), then this function is not fired until
//util's dependencies have loaded, and the util argument will hold
//the module value for "helper/util".
//});
