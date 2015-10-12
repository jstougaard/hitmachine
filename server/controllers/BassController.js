var utils = require('../music-utils'),
    //musicState = require('../music-state'),
    noteHelper = require('../play-note-helper'),
    config = require('../music-config'),
    rhythm = require('../rhythm-keeper');

// Constructor
function BassController(io, musicplayer) {
    if (!(this instanceof BassController)) return new BassController(io, musicplayer);

    this.name = "bass";

    this._io = io;
    this._musicplayer = musicplayer;

    this._pattern = [];
    this._indexedPattern = {};
    this._notePlaying = null;

    this.registerBeatEvents();
}

/**
 * Called whenever a new socket connects to the server
 * @param socket
 */
BassController.prototype.registerSocketEvents = function(socket) {
    var _this = this;

    // Send initial state
    socket.emit('update-bass-pattern', this._pattern);

    socket.on('update-bass-pattern', function(pattern) {
        console.log("New bass pattern", pattern);

        _this._pattern = pattern;
        _this._indexedPattern = utils.indexPattern(pattern);

        _this._io.emit('update-bass-pattern', pattern); // Send to all clients
    });
}

/**
 * Initiate event listeners on the beat keeper
 */
BassController.prototype.registerBeatEvents = function() {
    var _this = this;

    this._musicplayer.addListener("beat", function(beatCount) {


        if (_this._notePlaying && (_this._notePlaying.start + _this._notePlaying.length == beatCount || _this._notePlaying.start > beatCount)) {
            // Stop note
            _this._musicplayer.stopNote(_this.name, _this._notePlaying.note);
            _this._notePlaying = null;
        } else if (_this._indexedPattern[beatCount]) {

            if (_this.isMuted()) return;

            // Play note
            _this._musicplayer.playNote(_this.name, _this.getBaseNote(), _this.getConfig().volume);
            _this._notePlaying = _this._indexedPattern[beatCount];
            _this._notePlaying.note = _this.getBaseNote();
        }
    });
};

BassController.prototype.getConfig = function() {
    return config.instrumentConfig[this.name];
};

BassController.prototype.getBaseNote = function() {
    //return (musicState.getCurrentChord()[0] || 60) - 12;
    return noteHelper.getNoteToPlay(this.name, 1);
};

BassController.prototype.isMuted = function() {
    return this.getConfig(this.name).volume === 0 || this.getConfig(this.name).muted;
};

module.exports = BassController;