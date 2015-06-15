var Set = require('immutable').Set;

var ONE_SECOND = 1000;
var ONE_MINUTE = 60 * ONE_SECOND;

function Token(identifier, expiry) {
    this.identifier = identifier;
    this.expiry = expiry;
}

function TokenStore() {
    this._tokens = new Set();
}

TokenStore.prototype.create = function create(identifier, threshold) {
    threshold = threshold || ONE_MINUTE;

    var now = Date.now();
    var expiry = now + threshold;

    var token = new Token(identifier, expiry);

    this._tokens = this._tokens.add(token);

    return token;
};

TokenStore.prototype.consume = function consume() {
    var now = Date.now();

    var successToken = null;

    this._tokens.forEach(function (token) {
        // Remove the token regardless of validity
        this._tokens = this._tokens.remove(token);

        // Allow opening if the current time is less than the token's expiry
        if (now < token.expiry) {
            successToken = token;

            // Short-circuit out of the iteration
            return false;
        }
    }, this);

    return successToken;
};

module.exports = TokenStore;
