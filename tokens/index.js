var TokenStore = require('./token-store');

var tokens = new TokenStore();

module.exports = function (app) {
	app.all('/create-token', function (req, res) {
	    var username = req.query.username;
	    var token = tokens.create(username);

	    var response = {
			'success': true,
			'token': token
	    }

	    console.log('Created Token: %j', token);

		res.send(response);
	});

	app.all('/consume-token', function (req, res) {
	    var token = tokens.consume();

		if (token) {
			console.log('Consumed Token: %j', token);
			res.render('success');
		} else {
			console.log('Failed to consume');
			res.status(401).end();
		}
	});
};