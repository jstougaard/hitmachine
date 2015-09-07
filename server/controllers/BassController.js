var utils = require('../music-utils'),
    state = require('../music-state'),
    rhythm = require('../rhythm-keeper');

// Constructor
function BassController(io, musicplayer, connector) {
    if (!(this instanceof BassController)) return new BassController(io, musicplayer, connector);

    this._io = io;
    this._musicplayer = musicplayer;
    this._connector = connector;

    this._notePlaying = null;
    this.muted = true;

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

    this._musicplayer.addListener("beat", function(beatCount) {
        if (_this.muted) return;

        if (_this._notePlaying && _this._notePlaying.start + _this._notePlaying.length == beatCount) {
            // Stop note
            _this._connector.send("bass 0.0");
            _this.notePlaying = null;
        } else if (rhythm.getBaseBlockAt(beatCount)) {
            // Play note
            _this._connector.send("bass 0.1");
            _this._notePlaying = rhythm.getBaseBlockAt(beatCount);
        }
    });
}

module.exports = BassController;