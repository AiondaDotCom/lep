$(document).ready(function() {
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
          $('#alertLoginSuccess').hide()
          $('#alertLoginFailure').show()
        }
      },
      success: function(data) {
        //console.log(data);
        $('#alertLoginSuccess').show();
        $('#alertLoginFailure').hide();
        var jwt = data['jwt'];
        console.log(jwt);
        // Save JSON Web Token
        localStorage.setItem("jwt", jwt);

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
      }
    }).always(function() {
      l.stop(); // Stop the loading animation
    });
  })
})
