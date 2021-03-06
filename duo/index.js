var extend = require('extend');
var configDefaults = require('../config-defaults.json');
var configUser = require('../config.json');
var renderSuccess = require('../renderSuccess');
var config = extend(configDefaults, configUser);

var duoApi = require('duo_api');
var Router = require('express').Router;

var router = new Router();

var duoConfig = config.duo;
var duoClient = new duoApi.Client(duoConfig.integrationKey, duoConfig.secretKey, duoConfig.hostname);

router.all('/', function (req, res) {
	var email = req.query.email;
	if (!email) {
		res.status(400).send('email not specified');
		return;
	}

	var duoOptions = {
		'username': email,
		'factor': 'push',
		'device': 'auto'
	};

	duoClient.jsonApiCall('POST', '/auth/v2/auth', duoOptions, function (duoResponse) {
		if (duoResponse.response.result === 'allow') {
			console.log('Push allowed for %s', email);
			renderSuccess(req, res);
		} else {
			console.log('Push failed for %s', email);
			res.status(400).send('not allowed');
		}
	});
});

module.exports = router;
