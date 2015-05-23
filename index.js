#!/usr/bin/env node

var express = require('express');
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

app.use('/static', express.static('static'));

app.all('/', function (req, res) {
	var data = extend(config.display, req.query);
	var email = req.query.email;

	var duoOptions = {
		'username': email,
		'factor': 'push',
		'device': 'auto'
	};

	duoClient.jsonApiCall('POST', '/auth/v2/auth', duoOptions, function (duoResponse) {
		if (duoResponse.response.result === 'allow') {
			console.log('Push allowed for %s', email);
			var template = fs.readFileSync('templates/index.hbs', 'utf-8');
			var rendered = handlebars.compile(template);
			res.send(rendered(data));
		} else {
			console.log('Push failed for %s', email);
			res.status(400).send('not allowed');
		}
	});
});


var server = app.listen(config.server.port, config.server.host, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Listening at http://%s:%s', host, port)
});
