var path = require("path");

module.exports = function(app, passport, socket) {
  app.get('/', function(request, response) {
    if(request.isAuthenticated()) {
      return response.redirect('/public/account');
    } else {
      response.sendFile(path.join(__dirname + '/public/index.html'));
    }
  });

  // // Route for login/home page
  // app.get('/public/login', function(request, response) {
  // 	response.sendFile(path.join(__dirname + '/public/index.html'));
  // });

  // Route for logging out
  app.get('/logout', function(request, response){
    request.logout();
    response.redirect('/');
  });

  // Google routes
  // Route to Google to do authentication
  app.get('/auth/google',
    passport.authenticate('google', {scope: [
    	'profile',
    	'email'
    ]}
  ));

  // Callback from Google after authenticating the user
  app.get('/auth/google/callback',
    passport.authenticate('google', {
  	  failureRedirect: '/'
    }),
    function(request, response) {
  	  // Successful login
  	  return response.redirect('/public/account');
    }
  );

}
