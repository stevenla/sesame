var TokenStore = require('./token-store');
var Router = require('express').Router;

var tokens = new TokenStore();

var router = new Router();

router.all('/create', function (req, res) {
    var username = req.query.username;
    var token = tokens.create(username);

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
		res.render('success');
	} else {
		console.log('Failed to consume');
		res.status(401).end();
	}
});

module.exports = router;