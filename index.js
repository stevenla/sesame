#!/usr/bin/env node

var express = require('express');
var bodyParser = require('body-parser');
var expressHandlebars = require('express-handlebars');
var fs = require('fs');
var handlebars = require('handlebars');
var duoApi = require('duo_api');

var extend = require('extend');
var configDefaults = require('./config-defaults.json');
var configUser = require('./config.json');
var config = extend(configDefaults, configUser);

function render(fileName, data) {
	if (data === void 0) {
		data = {};
	}

	var template = fs.readFileSync(fileName, 'utf-8');
	var rendered = handlebars.compile(template);
	return rendered(data);
}

var duoClient = new duoApi.Client(config.integrationKey, config.secretKey, config.hostname);
var app = express();

app.engine('handlebars', expressHandlebars());
app.set('view engine', 'handlebars');

app.use('/static', express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }));

// Set config defaults to be global so the views can use them
app.locals.config = config.layout;

// Add URLs
require('./tokens')(app);


app.all('/', function (req, res) {
	var data = extend(config.display, req.query);
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
			res.send(render('views/success.handlebars', data));
		} else {
			console.log('Push failed for %s', email);
			res.status(400).send('not allowed');
		}
	});
});

app.all('/passcode', function (req, res) {
	var data = extend(config.layout, req.query);
	var passcode = req.query.passcode;
	var digits = req.body.Digits;
	if (!passcode) {
		res.status(400).send('passcode required');
		return;
	}

	if (!digits) {
		res.send(render('views/passcode-input.hbs', data));
		console.log('[%s] Access requested', new Date());
	} else if (digits == passcode) {
		res.send(render('views/success.handlebars', data));
		console.log('[%s] Access granted', new Date());
	} else {
		res.send(render('views/passcode-error.hbs', data));
		console.log('[%s] Access denied', new Date());
	}
});

app.all('/accept', function (req, res) {
	var data = extend(config.layout, req.query);
	res.send(render('views/success.handlebars', data));
});

var server = app.listen(config.server.port, config.server.host, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Listening at http://%s:%s', host, port)
});
