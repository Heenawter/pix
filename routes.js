var path = require("path");

module.exports = function(app, passport, socket) {
  // Route for login/home page
  app.get('/login', function(request, response) {
  	response.sendFile(path.join(__dirname + '/public/index.html'));
  });

// Pasted in index.js currently
/*
  // Route for the account page
  app.get('/account', ensureAuthenticated, function(request, response) {
    // Need a way to export request.user.user right here
    // loggedInUser = request.user.user;
    response.sendFile(path.join(__dirname + '/public/account.html'));
  });
*/
  // Route for logging out
  app.get('/logout', function(request, response){
    request.logout();
    response.redirect('/login');
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
  	  failureRedirect: '/login'
    }),
    function(request, response) {
  	  // Successful login
  	  return response.redirect('/account');
    }
  );

// Pasted in index.js currently
/*
  // Route middleware to ensure a user is logged in (Helper function)
  function ensureAuthenticated(request, response, next) {
    if (request.isAuthenticated()) {
  	console.log('User is authenticated and next is');
  	   return next(); }
    // If they aren't logged in, redirect back to the login page
    console.log('bad auth.. redirecing to login');
    return response.redirect('/login');
  }
*/
}
