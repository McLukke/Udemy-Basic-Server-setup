const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define our model
// local definition of what a user is for MongoDB
const userSchema = new Schema({
	email: { type: String, unique: true, lowercase: true },
	password: String
});

// On Save Hook, encrypt password
// Before saving a model, run this function; read literally as 'pre saving, do ...'
userSchema.pre('save', function(next) {
	// get access to user model - user is an instance of userModel
	const user = this;

	// generate a salt then run cb
	bcrypt.genSalt(10, function(err, salt) {
		if (err) return next(err);

		// encrypt password using salt
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) return next(err);

			// overwrite plain text pw with encrypted pw
			user.password = hash;

			// move to next work flow, which would be .save()
			next();
		});
	});
});

// Create the model class
// loads schema into mongoose
// tells mongoose there is a new schema about users
// corresponds to a collection named 'user'
// this schema applies to all users
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
