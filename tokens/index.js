var config = require('../config.json');
var TokenStore = require('./token-store');
var Router = require('express').Router;

var tokens = new TokenStore();

var router = new Router();

router.all('/create', function (req, res) {
	var username = req.query.username;
	var length = req.query.length;
	var token = tokens.create(username, length);
	// TODO: Enable whitelisting by making it more secure than just sending a get request with username param set
	/*
	if (config.userWhitelist.indexOf(username) < 0) {
		console.log('User outside of whitelist attempted to create token: %s', username);
		return res.send(null);
	}
	*/

	var response = {
		'success': true,
		'token': token
	}

	console.log('Created Token: %j', token);
	res.send(response);
});

router.all('/consume', function (req, res) {
	var token = tokens.consume();
	if (token) {
		console.log('Consumed Token: %j', token);
		res.render('success', {notify: req.query.notify});
	} else {
		console.log('Failed to consume');
		res.status(401).end();
	}
});

module.exports = router;
