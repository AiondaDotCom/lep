$(document).ready(function() {


  $.timeago.settings.allowFuture = true;
  $("time.timeago").timeago();


  var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!'
    }
  })

  $('#loginModal').on('shown.bs.modal', function() {
    // Focus email input when loginModal gets visible
    $('#inputEmail').focus()
  })

  $('#logoutButton').on('click', function(evt){
    // TODO: Delete saved jwt, reset everything / reload page
    location.reload();
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

        $('#logoutInDuration').html(
          '<time class="timeago" datetime="' + new Date(data['expireTimestamp'] * 1000).toISOString() + '">'
        );
        $("time.timeago").timeago();


        /*
        // Test token
        $.ajax({
          type: "GET",
          url: '/api/restricted',
          data: {
            'jwt': data,
          },
          success: function(data) {
                // callback code here
                //console.log('success')
                //console.log(data.success)
                console.log(data)

                // Save JSON Web Token
                //localStorage.setItem("jwt", data);
              }
        })*/
      },
      error: function(error) {
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
