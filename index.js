#!/usr/bin/env node

var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var handlebars = require('handlebars');
var duoApi = require('duo_api');

var extend = require('extend');
var configDefaults = require('./config-defaults.json');
var configUser = require('./config.json');
var config = extend(configDefaults, configUser);

var TokenStore = require('./token-store');

var tokens = new TokenStore();

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
app.use(bodyParser.urlencoded({ extended: false }));

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
        res.send(render('templates/index.hbs', data));
    } else {
        console.log('Push failed for %s', email);
        res.status(400).send('not allowed');
    }
});
});

app.all('/passcode', function (req, res) {
var data = extend(config.display, req.query);
var passcode = req.query.passcode;
var digits = req.body.Digits;
if (!passcode) {
    res.status(400).send('passcode required');
    return;
}

if (!digits) {
    res.send(render('templates/passcode-input.hbs', data));
    console.log('[%s] Access requested', new Date());
} else if (digits == passcode) {
    res.send(render('templates/index.hbs', data));
    console.log('[%s] Access granted', new Date());
} else {
    res.send(render('templates/passcode-error.hbs', data));
    console.log('[%s] Access denied', new Date());
}
});

app.all('/accept', function (req, res) {
var data = extend(config.display, req.query);
res.send(render('templates/index.hbs', data));
});

app.all('/create-token', function (req, res) {
    var username = req.query.username;
    tokens.create(username);
	res.end();
});

app.all('/consume-token', function (req, res) {
    var open = tokens.consume();

	if (open) {
		res.send(render('templates/index.hbs', config.display));
	} else {
		console.log ('failure');
		res.end();
	}
});

var server = app.listen(config.server.port, config.server.host, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Listening at http://%s:%s', host, port)
});
