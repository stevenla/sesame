var ONE_SECOND = 1000;
var ONE_MINUTE = 60 * ONE_SECOND;

function TokenStore() {
    this._tokens = {};
}

TokenStore.prototype.create = function create(identifier) {
    var now = Date.now();
    this._tokens[now] = true;
};

TokenStore.prototype.consume = function consume(aThreshold) {
    var tokenTimestamps = Object.keys(this._tokens);
    var threshold = Date.now() - (aThreshold || ONE_MINUTE);

    var open = false;
    for (var i = 0, length = tokenTimestamps.length; i < length; i++) {
        var timestamp = tokenTimestamps[i];

        // Consume the token regardless of validity
        delete this._tokens[timestamp];

        // Allow opening if the timestamp is past the threshold
        if (threshold < timestamp) {
            open = true;
            break;
        }
    }

    return open;
};

module.exports = TokenStore;
