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
    this.nextProgressionIndex = null;

    this.registerBeatEvents();
}

/**
 * Called whenever a new socket connects to the server
 * @param socket
 */
ProgressionController.prototype.registerSocketEvents = function(socket) {
    var _this = this;

    socket.emit('define-song-progression', config.songProgression);
    socket.emit('set-progression-index', this._progressionCount);

    socket.on('goto-song-progression', function(index) {
        _this.nextProgressionIndex = index;
    });
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
    var next = this.nextProgressionIndex || (this._progressionCount + 1);
    this._progressionCount = next % config.songProgression.length;
    this.nextProgressionIndex = null;

    // Find elements
    var currentElement = config.songProgression[this._progressionCount];
    var progressionElements = config.progressionElements[currentElement];

    //console.log("Run progression element", progressionElements);

    // Set volumes
    Object.keys(config.instrumentConfig).forEach(function(instrument) {
        config.instrumentConfig[instrument].muted = progressionElements.indexOf(instrument) >= 0 ? false : true;
    });

    this._io.emit('set-progression-index', this._progressionCount);
};


module.exports = ProgressionController;