var path = require("path");

module.exports = function(app, passport) {

  app.get('/', function(request, response) {
    if(request.isAuthenticated()) {
      return response.redirect('/public/account');
    } else {
      response.sendFile(path.join(__dirname + '/public/index.html'));
    }
  });

  app.get('/account', ensureAuthenticated, function(request, response) {
    response.sendFile(path.join(__dirname + '/public/account.html'));
  });

  app.get('/logout', function(request, response){
    app.emit("logout", request.user.user);
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
      app.emit("login", request.user.user);
  	  return response.redirect('/public/account');
    }
  );

  app.get('*', function(request, response) {
    if(request.isAuthenticated()) {
      return response.redirect('/account');
    } else {
      return response.redirect('/');
    }
  });

  // Route middleware to ensure a user is logged in (Helper function)
  function ensureAuthenticated(request, response, next) {
    if (request.isAuthenticated()) {
       return next(); }
    // If they aren't logged in, redirect back to the login page
    return response.redirect('/');
  }

}
