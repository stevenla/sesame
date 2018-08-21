var Router = require('express').Router;

var config = require('../config.json');
var TokenStore = require('./token-store');
var renderSuccess = require('../renderSuccess');
var parseNotify = require('../parseNotify');

var tokens = new TokenStore();
var router = new Router();

router.all('/create', function (req, res) {
	var username = req.query.username;
    var phoneNumber = req.body && req.body.From;
	var length = req.query.length;

    var user = '';
    if (username) {
        user = username;
    }

    if (phoneNumber) {
        if (username) {
            user += "_";
        }

        user += phoneNumber;
    }

    var phone_number_text_blacklist = config.phone_number_text_blacklist;
    if (phone_number_text_blacklist && phone_number_text_blacklist.indexOf(phoneNumber) >= 0) {
        return res.end();
    }

    var token = tokens.create(user, length);
	console.log('Created Token: %j', token);

	var response = {
        'message': JSON.stringify({
            'success': true,
            'token': token,
            'phone_number': phoneNumber,
        }, 2)
    };
	res.render('text_success', response);
});

router.all('/consume', function (req, res) {
	var token = tokens.consume();
    if (!req.body || !req.body.From) {
        console.log("Rejecting call from %s", JSON.stringify(req.body));
        return res.render('reject_call');
    }

    var number = req.body.From;
    var phone_call_whitelist = config.phone_number_call_whitelist;
    if (phone_call_whitelist && phone_call_whitelist.indexOf(number) < 0) {
        console.log("Rejecting call from %s", number);
        return res.render('reject_call');
    }

	if (token) {
		console.log('Consumed Token: %j, query: %s', token, JSON.stringify(req.query));
		return renderSuccess(req, res, token.identifier);
	} else {
		console.log('Failed to consume');
        var failureParams = parseNotify(req);
        return res.render('failure', failureParams);
	}
});

module.exports = router;
