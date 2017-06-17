var Router = require('express').Router;

var config = require('../config.json');
var TokenStore = require('./token-store');
var renderSuccess = require('../renderSuccess');
var parseNotify = require('../parseNotify');

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
	var yoRecipient = req.query.yo;
	var yoApiKey = req.query.yoApiKey;

	if (token) {
		console.log('Consumed Token: %j, query: %s', token, JSON.stringify(req.query));
		// res.render('success', {notify: req.query.notify});
		return renderSuccess(req, res);
	} else {
		console.log('Failed to consume');
        var failureParams = parseNotify(req);
        return res.render('failure', failureParams);
	}
});

module.exports = router;
