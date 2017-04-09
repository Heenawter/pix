var GoogleStrategy = require('passport-google-oauth20').Strategy;
// Load the auth variables
var config = require('./oauth.js');

module.exports = function(passport, db) {
  // Used to serialize the user for the session
  passport.serializeUser(function(user, done) {
  	return done(null, user.email);
  });

  // Used to deserialize the user
  passport.deserializeUser(function(email, done) {
  	db.get("SELECT * FROM users WHERE (email = '"
              + email + "')" , function(err, row) {
                  if (row) {
                      // A user is found
                      return done(err, row);
                  } else {
  					          return done(null, false);
                  }
              });
  });

  passport.use(new GoogleStrategy({
    clientID : config.google.clientID,
    clientSecret : config.google.clientSecret,
    callbackURL : config.google.callbackURL,
    passReqToCallback: true
    },
    function(request, accessToken, refreshToken, profile, done) {
  	  // Provides asynchrony
      process.nextTick(function () {
    		// Use first email
    		let email = profile.emails[0].value;

        // Look for the user based on their google email
        db.get("SELECT user,email FROM users WHERE (email = '"
                  + email + "')" , function(err, row) {
          if (err) {
            return done(err);
          }

          if (row) {
            // A user is found, so log them in
            return done(null, row);
          } else {
      			// The user isn't in the database, so create a new user
            db.run("INSERT INTO users (user, email) VALUES ('"
                      + profile.displayName + "', '"
                      + email + "')");

            // Get the user object to return
            db.get("SELECT user,email FROM users WHERE (email = '"
                      + email + "')" , function(err, row) {
              if (err) {
                return done(err);
              }
              return done(null, row);
            });
        }
      });
    });
  }));
}
