var utils = require('../music-utils'),
    musicState = require('../music-state'),
    config = require('../music-config'),
    rhythm = require('../rhythm-keeper');

// Constructor
function ProgressionController(io, musicplayer) {
    if (!(this instanceof ProgressionController)) return new ProgressionController(io, musicplayer);

    this._musicplayer = musicplayer;
    this._io = io;

    this._loopCount = -1;
    this._progressionCount = -1;

    this.registerBeatEvents();
}

/**
 * Called whenever a new socket connects to the server
 * @param socket
 */
ProgressionController.prototype.registerSocketEvents = function(socket) {
    var _this = this;

    // Do nothing
}

/**
 * Initiate event listeners on the beat keeper
 */
ProgressionController.prototype.registerBeatEvents = function() {
    var _this = this;

    this._musicplayer.addListener("loop", function() {
        _this._loopCount++;

        if (_this._loopCount >= 4) {
            _this._loopCount = 0;
        }

        if (_this._loopCount === 0) {
            _this.advanceProgression();
        }
    });
};

ProgressionController.prototype.advanceProgression = function() {
    // Increment
    this._progressionCount = (this._progressionCount + 1) % config.songProgression.length;

    // Find elements
    var currentElement = config.songProgression[this._progressionCount];
    var progressionElements = config.progressionElements[currentElement];

    //console.log("Run progression element", progressionElements);

    // Set volumes
    Object.keys(config.instrumentConfig).forEach(function(instrument) {
        config.instrumentConfig[instrument].muted = progressionElements.indexOf(instrument) >= 0 ? false : true;
    });
};


module.exports = ProgressionController;