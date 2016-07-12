// Main starting point of the app
const express = require('express');
const http = require('http'); // http is a very low lvl native nodejs library
const bodyParser = require('body-parser'); // parse incoming requests into json
const morgan = require('morgan'); // logging framework for incoming requests for the server
const app = express(); // an instance of express

const router = require('./router');
const mongoose = require('mongoose');

// DB Setup
mongoose.connect('mongodb://localhost:auth/auth'); // connect server to instance of mongodb

// App Setup
// middleware express - run requests through them
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' })); // parse all request types
router(app);

// Server Setup
const port = process.env.PORT || 3090; // environment variable called PORT
const server = http.createServer(app); // works with incoming http requests
server.listen(port);
console.log('Server listening on:', port);

// nodemon:
// watches project dir for file changes & restart server should file change

// TECH STACK
// Low-level request handling:
// 	-HTTP Module
// 		HandleHTTP requests

// Routing, Server logic:
// 	-BodyParser
// 		Help parse incoming HTTP requests
// 	-Morgan
// 		Logging
// 	-Express
// 		Parse response + routing

// Database:
// 	-MongoDB
// 		Storing Data
// 	-Mongoose
// 		working with MongoDB

// Authentication:
// 	-Bcrypt-Node.js
// 		Storing a users password safely
// 	-Passport-JWT
// 		Authenticating users with a JWT
// 	-Passport-Local:
// 		Authenticating users with a username/password
// 	-Passport JS
// 		Authenticating users
