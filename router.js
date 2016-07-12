// node js export
const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// object to insert in middleware, the interceptor
// use passport to authenticate, using jwt strategy, when authenticated, dont create a cookie-based session (this is a token based approach, dont need a cookie even tho this is the jwt default)
const requireAuth = passport.authenticate('jwt', { session: false }); 

module.exports = function(app) {
	// app.get('/', function(req, res, next) {
	// 	res.send(['waterbottle', 'phone', 'paper']);
	// });

	// root route, first send them through requireAuth, then run fn to handle request
	app.get('/', requireAuth, function(req, res) {
		res.send({ hi: 'there' });
	});

	app.post('/signup', Authentication.signup);
}
