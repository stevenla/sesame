#!/usr/bin/env node

var express = require('express');
var fs = require('fs');
var handlebars = require('handlebars');
var duoApi = require('duo_api');

var config = require('./config.json');

var duoClient = new duoApi.Client(config.integrationKey, config.secretKey, config.hostname);
var app = express();

app.get('/requestAll', function (req, res) {
	config.pushToUsers.forEach(function (username) {
		var options = {
			'username': username,
			'factor': 'push',
			'device': 'auto'
		};

		var done = false;
		duoClient.jsonApiCall('POST', '/auth/v2/auth', options, function (duoResponse) {
			if (duoResponse.response.result === 'allow') {
				console.log('Push allowed for %s', username);
				var template = fs.readFileSync('templates/p9.xml', 'utf-8');
				var rendered = handlebars.compile(template);
				done = true;
				if (!done) {
					res.send(rendered());
				}
			} else {
				console.log('Push failed for %s', username);
			}
		});
	});
});

app.get('/', function (req, res) {
	var template = fs.readFileSync('templates/index.xml', 'utf-8');
	var rendered = handlebars.compile(template);
	res.send(rendered());
});

app.use('/static', express.static('static'));

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Listening at http://%s:%s', host, port)
});
