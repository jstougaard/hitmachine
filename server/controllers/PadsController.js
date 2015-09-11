var utils = require('../music-utils'),
    musicState = require('../music-state'),
    config = require('../music-config');


// Constructor
function PadsController(io, musicplayer) {
    if (!(this instanceof PadsController)) return new PadsController(io, musicplayer);

    this.name = "pads";

    this._io = io;
    this._musicplayer = musicplayer;

    this._notesPlaying = [];

    this.registerBeatEvents();
}

/**
 * Called whenever a new socket connects to the server
 * @param socket
 */
PadsController.prototype.registerSocketEvents = function(socket) {
    var _this = this;



};

/**
 * Initiate event listeners on the beat keeper
 */
PadsController.prototype.registerBeatEvents = function() {
    var _this = this;

    var loopCount = 0;

    // Play notes
    this._musicplayer.addListener("loop", function() {
        // Stop playing notes
        _this._notesPlaying.forEach(function(note) {
            _this._musicplayer.stopNote(_this.name, note);
        });
        _this._notesPlaying = [];


        // Start notes
        if (!_this.isMuted()) {
            //console.log("Play pads");
            var chord = musicState.getCurrentChord();
            for (var i=0; i < 3; i++) {
                _this._musicplayer.playNote(_this.name, chord[i], _this.getConfig().volume);
                _this._notesPlaying.push(chord[i]);
            }
        }

        loopCount = (loopCount + 1) % 4;

    });
};

PadsController.prototype.getConfig = function() {
    return config.instrumentConfig[this.name];
};

PadsController.prototype.isMuted = function() {
    return this.getConfig(this.name).volume === 0 || this.getConfig(this.name).muted;
};

module.exports = PadsController;