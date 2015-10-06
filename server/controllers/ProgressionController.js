var utils = require('../music-utils'),
    musicState = require('../music-state'),
    config = require('../music-config'),
    rhythm = require('../rhythm-keeper');

var loopsPerChordProgression = 4;

// Constructor
function ProgressionController(io, musicplayer) {
    if (!(this instanceof ProgressionController)) return new ProgressionController(io, musicplayer);

    this._musicplayer = musicplayer;
    this._io = io;

    this._loopCount = -1;
    this._currentProgressionElement = null;
    this.nextProgressionId = null;
    musicState.setCurrentSongProgression(config.songProgression);

    this.registerBeatEvents();
}

/**
 * Called whenever a new socket connects to the server
 * @param socket
 */
ProgressionController.prototype.registerSocketEvents = function(socket) {
    var _this = this;

    socket.emit('define-song-progression-elements', Object.keys(config.progressionElements));
    this.emitProgressionId(socket);
    this.emitProgression(socket);


    socket.on('update-song-progression', function(progression) {
        musicState.setCurrentSongProgression(progression);
        _this._io.emit("update-song-progression", musicState.getCurrentSongProgression());
    });

    socket.on('set-next-progression-id', function(progressionId) {
        _this.nextProgressionId = progressionId;
    });
}

/**
 * Initiate event listeners on the beat keeper
 */
ProgressionController.prototype.registerBeatEvents = function() {
    var _this = this;

    this._musicplayer.addListener("loop", function() {
        _this._loopCount++;

        if (_this._loopCount >= loopsPerChordProgression * config.chordProgressionsPerElement) {
            _this._loopCount = 0;
        }

        if (_this._loopCount === 0) {
            _this.advanceProgression();
        }
    });
};

ProgressionController.prototype.advanceProgression = function() {
    // Increment
    var nextIndex = this.getNextProgressionIndex();

    // Find elements
    this._currentProgressionElement = musicState.getCurrentSongProgression()[nextIndex];
    var progressionElements = config.progressionElements[this._currentProgressionElement.name];

    // Set volumes
    Object.keys(config.instrumentConfig).forEach(function(instrument) {
        if (instrument.indexOf("lead") === 0) return; // Do not mute leads

        config.instrumentConfig[instrument].muted = progressionElements.indexOf(instrument) >= 0 ? false : true;
    });

    this.emitProgressionId();
};

ProgressionController.prototype.getNextProgressionIndex = function() {
    var next = null;


    if (this.nextProgressionId !== null) {
        // Use next as requested

        musicState.getCurrentSongProgression().forEach(function(item, index) {
            if (item.id === this.nextProgressionId) {
                next = index;
            }
        }, this);

        this.nextProgressionId = null;
    }

    if (next === null && this._currentProgressionElement !== null) {
        // Determine my index and increment
        musicState.getCurrentSongProgression().forEach(function(item, index) {
            if (item.id === this._currentProgressionElement.id) {
                next = index + 1;
            }
        }, this);

        next = next % musicState.getCurrentSongProgression().length;
    }

    return next || 0;
}

ProgressionController.prototype.emitProgression = function(socket) {
    var channel = socket || this._io;
    channel.emit('update-song-progression', musicState.getCurrentSongProgression());
};

ProgressionController.prototype.emitProgressionId = function(socket) {
    if (!this._currentProgressionElement) return;

    var channel = socket || this._io;
    channel.emit('set-current-progression-id', this._currentProgressionElement.id);

};


module.exports = ProgressionController;