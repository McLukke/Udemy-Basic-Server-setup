const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

// to generate a token for signed in users
function tokenForUser(user) {
	const timestamp = new Date().getTime();

	return jwt.encode({
		sub: user.id, // sub = subject, who does this token belong to
		iat: timestamp // issue-at time
	}, config.secret); // dont use email, changes over time
}

exports.signup = function(req, res, next) {
	// test with Postman to see the following work
	// res.send({ success: 'true' });

	// pull data out of request object
	console.log(req.body);
	const email = req.body.email;
	const password = req.body.password;

	// in the event users leave email field blank
	// also, this is where we verify actual email entered
	if (!email || !password) {
		return res.status(422).send({ error: 'You must provide email and password' });
	}

	// See if a user with the given email exists - look through entire db
	User.findOne({ email: email }, function(err, existingUser) { // check all users in db for 1 user, returns err or null for existing User if not found
		if (err) { return next(err); }

		// If email exist, return error
		if (existingUser) {
			return res.status(422).send({ error: 'Email is in use' }); // 422 = unprocessable entity
		}

		// If not, create user record
		const user = new User({
			email: email,
			password: password
		});

		// save new user to db
		user.save(function(err) {
			if (err) { return next(err); }

			// Respond to request indicating the user was created
			res.json({
				// good that we log the successful action but
				// real world app we generate JSON Web Token (JWT) in exchange for a login id
				// future auth requests user supply JWT
				
				// success: true
				token: tokenForUser(user) // now to use the token
			});
		});
	});
}