var Router = require('express').Router;
var renderSuccess = require('../renderSuccess');

var router = new Router();

router.all('/', function (req, res) {
	var passcode = req.query.passcode;
	var digits = req.body.Digits;
	if (!passcode) {
		res.status(400).send('passcode required');
		return;
	}

	if (!digits) {
		console.log('[%s] Access requested', new Date());
		res.render('passcode-input');
	} else if (digits == passcode) {
		console.log('[%s] Access granted', new Date());
		renderSuccess(req, res);
	} else {
		console.log('[%s] Access denied', new Date());
		res.render('passcode-error');
	}
});

module.exports = router;
