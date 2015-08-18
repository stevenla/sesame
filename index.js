#!/usr/bin/env node

var express = require('express');
var bodyParser = require('body-parser');
var expressHandlebars = require('express-handlebars');

// TODO: config needs to be better
var extend = require('extend');
var configDefaults = require('./config-defaults.json');
var configUser = require('./config.json');
var config = extend(configDefaults, configUser);

var app = express();

app.engine('handlebars', expressHandlebars());
app.set('view engine', 'handlebars');

app.use('/static', express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }));

// Set config defaults to be global so the views can use them
app.locals.config = config.layout;

// Add validation services
app.use('/tokens', require('./tokens'));
app.use('/duo', require('./duo'));
app.use('/passcode', require('./passcode'));

app.all('/accept', function (req, res) {
	res.render('success');
});

app.all('/', function (req, res) {
	res.render('splash');
});

var server = app.listen(config.server.port, config.server.host, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Listening at http://%s:%s', host, port)
});
