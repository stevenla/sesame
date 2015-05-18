#!/usr/bin/env node

var express = require('express');
var fs = require('fs');
var handlebars = require('handlebars');
var duoApi = require('duo_api_nodejs');

var config = require('./config.json');

var duoClient = new duoApi.Client(config.integrationKey, config.secretKey, config.hostname);
var app = express();

app.get('/', function (req, res) {
	var options = {
		'username': 'mrstevenla@gmail.com',
		'factor': 'push',
		'device': 'auto'
	};

	duoClient.jsonApiCall('POST', '/auth/v2/auth', options, function(duoResponse) {
		console.log(duoResponse);
		var template = fs.readFileSync('templates/index.xml', 'utf-8');
		var rendered = handlebars.compile(template);
		res.send(rendered());
	});
});

app.use('/static', express.static('static'));

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Listening at http://%s:%s', host, port)
});
