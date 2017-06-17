var Yo = require('ympc-yo');
var parseNotify = require('./parseNotify');

/**
 * Render a success TwiML and optionally sends notifications
 * To notify via SMS:
 *   req.query.notify = sms:4081234567
 *   req.query.notify = 4081234567
 * To notify via yo:
 *   req.query.notify = yo:recipient:api-key
 */
function renderSuccess(req, res) {
	var notifyQuery = req.query.notify || '';
	var notify = notifyQuery.split(':');
	var protocol = notify[0];
	var successParams = parseNotify(req);
	return res.render('success', successParams);
}

module.exports = renderSuccess;
