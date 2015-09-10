var state = require('../music-state'),
    rhythm = require('../rhythm-keeper');

// Constructor
function RhythmController(io, musicplayer) {
    if (!(this instanceof RhythmController)) return new RhythmController(io, musicplayer);

    this._io = io;
    this._musicplayer = musicplayer;
    this._nextBasePattern = null;

    this.registerBeatEvents();
}

/**
 * Called whenever a new socket connects to the server
 * @param socket
 */
RhythmController.prototype.registerSocketEvents = function(socket) {
    var _this = this;

    // Send initial state
    //console.log("Emitting base pattern", this._musicplayer.getBasePattern());
    socket.emit('update-base-pattern', rhythm.getBasePattern());
    socket.emit("beat", null);


    socket.on('update-base-pattern', function(pattern) {
        console.log("New base pattern", pattern);

        // TODO: Only do this at beginning of loop
        rhythm.setBasePattern(pattern);
        // _this._nextBasePattern = pattern; //TODO: Use this?

        _this._io.emit('update-base-pattern', pattern); // Send to all clients
    });

    socket.on('start-beat', function() {
        console.log("Start playing!");
        _this._musicplayer.start();
        _this._io.emit('start-beat', true); // Send to all clients
    });

    socket.on('stop-beat', function() {
        console.log("Stop playing!");
        _this._musicplayer.stop();
        // TODO: Kill all sounds
        _this._io.emit('stop-beat', true); // Send to all clients
    });
}

/**
 * Initiate event listeners on the beat keeper
 */
RhythmController.prototype.registerBeatEvents = function() {
    var _this = this;

    this._musicplayer.addListener("beat", function(beatCount) {
        _this._io.emit("beat", beatCount);
    });

    this._musicplayer.addListener("loop", function() {
        if (_this._nextBasePattern) {
            console.log("Persist pattern", _this._nextBasePattern);
            rhythm.setBasePattern(_this._nextBasePattern);
            _this._nextBasePattern = null;
        }
    });
}


module.exports = RhythmController;