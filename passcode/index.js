var Router = require('express').Router;

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
		res.render('success', {notify: req.query.notify});
	} else {
		console.log('[%s] Access denied', new Date());
		res.render('passcode-error');
	}
});

module.exports = router;