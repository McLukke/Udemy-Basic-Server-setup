const passport = require('passport'); // more of an ecosystem formed by Strategies
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy; // encapsulated single methods for authenticating users, whether with tokens or username/password
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// we neeth authentication layer before heading to authenticated routes & protected controllers
// we want users to hit this passport before hitting controllers

// Incoming Request -> Router -> *Logged In?* -> Controllers -> Response
// we're building the intercepter component that checks if users are logged in or not, which then lets them access controllers or sends them back to homepage

// Incoming Request -> Passport/passport-jwt -> Route Handler
// 												|             |
// 												|							|
// 											<-							->
// 			Passport Strategy 1							Passport Strategy 2
// 		-verify user with a JWT 					- verify user with a username & password




module.exports = function(passport) {
	// Create local strategy
	// to login, LocalStrategy expects us to pass in a username and a password
	// it's expecting a 'password' field which exists
	// we need to remap the email field to the username field
	const localOptions = { usernameField: 'email' };
	const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
		// Verify this username and password, call done with the username
		// if it is correct, call done
		// else, call done with false
		User.findOne({ email: email }, function(err, user) {
			if (err) return done(err);
			if (!user) return done(null, false);

			// compare passwords - is 'password' equal to user.password?
			// calling user that we found in our records
			// calling the custom method made from within userSchema setup
			user.comparePassword(password, function(err, isMatch) {
				// remember, this is the function 'callback' we throw into user.js
				if (err) return done(err);
				if (!isMatch) return done(null, false);

				return done(null, user);
			});
		});
	});

	// Setup options for JWT Strategy
	// the token could be in the body, url, headers etc...
	// this is where we tell JwtStrategy where to look for jwt token
	const jwtOptions = {
		jwtFromRquest: ExtractJwt.fromHeader('authorization'), // when request comes, tell Strategy to look for token from header called 'authorization'
		secretOrKey: config.secret
	};

	// Create JWT strategy
	// payload = decoded jwt token; from authentication, our payload is the decoded vsn of jwt.encode({ sub: user.id, iat: timestamp })
	// done = cb fn to call depending on sucessfulness of user authentication
	const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
		// Goal of this Strategy:
		// See if user ID in payload exists in our db
		// If so, call 'done' with that user
		// else, call 'done' without a user object

		User.findById(payload.sub, function(err, user) {
			if (err) return done(err, false);

			if (user) {
				done(null, user);
			} else {
				done(null, false);
			}
		});
	});

	// Tell passport to use this strategy
	passport.use(jwtLogin);
	passport.use(localLogin);
};
