var utils = require('../music-utils');

// Constructor
function BassController(io, beatkeeper, connector) {
    if (!(this instanceof BassController)) return new BassController(io, beatkeeper, connector);

    this._io = io;
    this._beatkeeper = beatkeeper;
    this._connector = connector;

    this._notePlaying = null;
    this._indexedPattern = utils.indexPattern(this._beatkeeper.getBasePattern());

    this.registerBeatEvents();
}

/**
 * Called whenever a new socket connects to the server
 * @param socket
 */
BassController.prototype.registerSocketEvents = function(socket) {

}

/**
 * Initiate event listeners on the beat keeper
 */
BassController.prototype.registerBeatEvents = function() {
    var _this = this;

    this._beatkeeper.addListener("new-base-pattern", function(pattern) {
        _this._indexedPattern = utils.indexPattern(pattern);

    })

    this._beatkeeper.addListener("beat", function(beatCount) {
        if (_this._notePlaying && _this._notePlaying.start + _this._notePlaying.length == beatCount) {
            // Stop note
            _this._connector.send("bass 0.0");
            _this.notePlaying = null;
        } else if (_this._indexedPattern[beatCount]) {
            // Play note
            _this._connector.send("bass 0.1");
            _this._notePlaying = _this._indexedPattern[beatCount];
        }
    });
}

module.exports = BassController;