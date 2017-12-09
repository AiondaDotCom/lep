require(['jquery', 'vue', 'ladda', 'bootstrap', 'timeago'], function($, Vue, Ladda) {

  $(document).ready(function() {
    $.timeago.settings.allowFuture = true;
    $("time.timeago").timeago();

    var app = new Vue({
      el: '#app',
      data: {
        user: {
          isLoggedIn: false,
          name: 'test',
          lastLogin: '',
          logoutInDuration: '',
          accountType: '',
        },
        createAccountModal: {
          error: false,
          errorMessage: 'Error'
        },
        restrictedContent: ''
      },
      methods: {
        testRestrictedAPI: function() {
          console.log('CLICK!!')
          var jwt = localStorage.getItem('jwt');

          // Test token
          $.ajax({
            type: "GET",
            url: '/api/restricted',
            data: {
              'jwt': jwt,
            },
            success: function(data) {
              console.log(data)
              app.restrictedContent = data;
            },
            error: function(error) {
              console.log(error)
              app.restrictedContent = "An error occured: " + error;
            }
          })
        }
      }
    })


    $('#loginModal').on('shown.bs.modal', function() {
      // Focus email input when loginModal gets visible
      $('#inputEmail').focus()
    })

    $('#logoutButton').on('click', function(evt) {
      // TODO: Delete saved jwt, reset everything / reload page
      location.reload();
    })

    /*$('#testRestrictedAPIButton').on('click', function(evt) {
      console.log('click');
    })*/



    $('#createAccountForm').on('submit', function(evt) {
      evt.preventDefault();
      // Initialize Ladda for this button
      var l = Ladda.create(document.querySelector('#createAccountButton'));
      l.start(); // Start the loading animation

      var mail = $('#createAccountInputEmail').val();
      var password = $('#createAccountInputPassword').val();

      $.ajax({
        type: "GET",
        url: '/api/user/create',
        data: {
          'name': mail,
          'password': password
        },
        statusCode: {
          401: function(response) {
            // Unauthorized
            console.log('Unauthorized');
          }
        },
        success: function(data) {
          console.log(data)
          $('#createAccountModal').modal('hide');
          app.createAccountModal.error = true;
        },
        error: function(error) {
          app.createAccountModal.error = true;
          console.log(error);
          if ('message' in error.responseJSON) {
            app.createAccountModal.errorMessage = 'Error: ' + error.responseJSON.message;
          } else {
            app.createAccountModal.errorMessage = 'Error';
          }
        }
      }).always(function() {
        l.stop(); // Stop the loading animation
      });
    })

    $('#loginForm').on('submit', function(evt) {
      evt.preventDefault();

      // Initialize Ladda for this button
      var l = Ladda.create(document.querySelector('#signInButton'));
      l.start(); // Start the loading animation

      var mail = $('#inputEmail').val();
      var password = $('#inputPassword').val();

      $.ajax({
        type: "GET",
        url: '/api/user/login',
        data: {
          'name': mail,
          'password': password
        },
        statusCode: {
          401: function(response) {
            // Unauthorized
            console.log('Wrong username or password')
            console.log(response);
            $('#alertLoginSuccess').slideUp('slow');
            $('#alertLoginFailure').slideDown('slow');
          }
        },
        success: function(data) {
          //console.log(data);
          $('#alertLoginSuccess').slideDown('slow');
          $('#alertLoginFailure').slideUp('slow');
          var jwt = data['jwt'];
          console.log(jwt);
          console.log('Login expires at ', data['expireTimestamp']);
          // Save JSON Web Token
          localStorage.setItem("jwt", jwt);
          localStorage.setItem("userName", data['userName']);

          $('#showCreateAccountModalButton').hide();
          $('#showLoginModalButton').hide();

          $('#logoutButton').show();

          $('#loginModal').modal('hide');

          app.user.isLoggedIn = true;

          app.user.logoutInDuration = '<time class="timeago" datetime="' + new Date(data['expireTimestamp'] * 1000).toISOString() + '">';
          $("time.timeago").timeago();

          app.user.name = data['userName'];
          app.user.accountType = data['accountType'];
          //app.user.logoutInDuration = data['expireTimestamp'];
        },
        error: function(error) {
          app.user.isLoggedIn = false;
          console.log('ERROR', error);
          $('#showCreateAccountModalButton').show();
          $('#showLoginModalButton').show();

          $('#logoutButton').hide();

        }
      }).always(function() {
        l.stop(); // Stop the loading animation
      });
    })
  })

})
