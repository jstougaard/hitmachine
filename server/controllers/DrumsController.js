var utils = require('../music-utils'),
    config = require('../music-config'),
    rhythm = require('../rhythm-keeper'),
    logger = require('../Logger');

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
        "hihat": [],
        "ride": []
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

        logger.newDrumPattern(drumName, pattern);

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

        _this._drumsPlaying.forEach(function(note) {
            // Always stop - Drums do not have length
            _this._musicplayer.stopNote(_this.name, note);
        });
        _this._drumsPlaying = [];

        if (_this.isFullyMuted()) return; // Muted

        for (var drumName in _this._indexedPatterns) {

            if (_this.isMuted(drumName)) continue;

            if (_this._indexedPatterns[drumName][beatCount]) {
                var note = _this.getDrumNote(drumName);
                _this._musicplayer.playNote(_this.name, note, _this.getConfig(drumName).volume);
                _this._drumsPlaying.push(note);
            }
        }

    });


    // Play crash
    var loopCount = 0;
    var crashDrumName = "crash";
    this._musicplayer.addListener("loop", function() {

        // Start notes
        if (loopCount === 0 && !_this.isMuted(crashDrumName)) {
            var note = _this.getDrumNote(crashDrumName);
            _this._musicplayer.playNote(_this.name, note, _this.getConfig(crashDrumName).volume);
            _this._drumsPlaying.push(note);
        }

        loopCount = (loopCount + 1) % 4;
    });
};

DrumsController.prototype.getConfig = function(drumName) {
    return config.instrumentConfig[drumName];
};

DrumsController.prototype.getDrumNote = function(drumName) {
    return this.getConfig(drumName).note + this.getDrumNoteOffset(drumName);
};

DrumsController.prototype.getDrumNoteOffset = function(drumName) {
    return this.getConfig(drumName).sound ? this.getConfig(drumName).sound - 1 : 0;
};

DrumsController.prototype.doesDrumExist = function(drumName) {
    return this.getConfig(drumName) && this.getDrumNote(drumName);
};

DrumsController.prototype.isFullyMuted = function() {
    return this.isMuted("kick") && this.isMuted("snare") && this.isMuted("hihat") && this.isMuted("ride") && this.isMuted("crash");
};

DrumsController.prototype.isMuted = function(drumName) {
    return this.getConfig(drumName).volume == 0 || this.getConfig(drumName).muted;
};

module.exports = DrumsController;