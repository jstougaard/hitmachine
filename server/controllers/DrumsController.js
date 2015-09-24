var utils = require('../music-utils'),
    config = require('../music-config'),
    rhythm = require('../rhythm-keeper');

var kickPattern = [ {"start": 0, "length": 1}, {"start": 4, "length": 1}, {"start": 8, "length": 1}, {"start": 12, "length": 1} ];
var snarePattern = [ {"start": 4, "length": 1}, {"start": 12, "length": 1} ];

// Constructor
function DrumsController(io, musicplayer) {
    if (!(this instanceof DrumsController)) return new DrumsController(io, musicplayer);

    this.name = "drums";

    this._io = io;
    this._musicplayer = musicplayer;


    this._patterns = {
        "kick": kickPattern,
        "snare": snarePattern,
        "hihat": []
    };

    // Init index pattern
    this._indexedPatterns = {};
    for (var drumName in this._patterns) {
        this._indexedPatterns[drumName] = utils.indexPattern(this._patterns[drumName]);
    }

    this._drumsPlaying = [];

    this.registerBeatEvents();
}

/**
 * Called whenever a new socket connects to the server
 * @param socket
 */
DrumsController.prototype.registerSocketEvents = function(socket) {
    var _this = this;

    // Init
    for (var drumName in _this._patterns) {
        socket.emit('update-drum-pattern', drumName, this._patterns[drumName]);
    }

    socket.on('update-drum-pattern', function(drumName, pattern) {
        if (!_this.doesDrumExist(drumName)) {
            console.log("Drum not found", drumName);
            return;
        }
        console.log("New drum pattern", drumName, pattern);
        _this._patterns[drumName] = pattern;
        _this._indexedPatterns[drumName] = utils.indexPattern(pattern);
        _this._io.emit('update-drum-pattern', drumName, pattern); // Send to all clients
    });

};

/**
 * Initiate event listeners on the beat keeper
 */
DrumsController.prototype.registerBeatEvents = function() {
    var _this = this;

    this._musicplayer.addListener("beat", function(beatCount) {

        _this._drumsPlaying.forEach(function(drumName) {
            // Always stop - Drums do not have length
            _this._musicplayer.stopNote(_this.name, _this.getDrumNote(drumName));
        });
        _this._drumsPlaying = [];

        if (_this.isFullyMuted()) return; // Muted

        for (var drumName in _this._indexedPatterns) {

            if (_this.isMuted(drumName)) continue;

            if (_this._indexedPatterns[drumName][beatCount]) {
                _this._musicplayer.playNote(_this.name, _this.getDrumNote(drumName), _this.getConfig(drumName).volume);
                _this._drumsPlaying.push(drumName);
            }
        }

    });
};

DrumsController.prototype.getConfig = function(drumName) {
    return config.instrumentConfig[drumName];
};

DrumsController.prototype.getDrumNote = function(drumName) {
    return this.getConfig(drumName).note;
};

DrumsController.prototype.doesDrumExist = function(drumName) {
    return this.getConfig(drumName) && this.getDrumNote(drumName);
};

DrumsController.prototype.isFullyMuted = function() {
    return this.isMuted("kick") && this.isMuted("snare") && this.isMuted("hihat");
};

DrumsController.prototype.isMuted = function(drumName) {
    return this.getConfig(drumName).volume == 0 || this.getConfig(drumName).muted;
};

module.exports = DrumsController;