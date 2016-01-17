var Yo = require('ympc-yo');

/**
 * Render a success TwiML and optionally sends notifications
 * To notify via SMS:
 *   req.query.notify = sms:4081234567
 * To notify via yo:
 *   req.query.notify = yo:recipient:api-key
 */
function renderSuccess(req, res) {
	var notifyQuery = req.query.notify || '';
	var notify = notifyQuery.split(':');
	var protocol = notify[0];
	var successParams = {};
	switch (protocol) {
		case 'sms':
			var number = notify[1];
			successParams = { notify: number };
			break;

		case 'yo':
			var yoRecipient = notify[1];
			var yoApiKey = notify[2];
			(new Yo(yoApiKey))
				.yo(yoRecipient)
				.then(function (res) {
					console.log('[%s] Sent yo to %s', new Date(), yoRecipient);
				});
			break;

		default:
			// no default
	}

	return res.render('success', successParams);
}

module.exports = renderSuccess;
