var utils = require('../music-utils'),
    state = require('../music-state');

// TODO: Use correct note values + enable notes from chord
var noteMap = [ 60, 61, 62, 63, 64 ];

// Constructor
function LeadController(io, musicplayer, connector) {
    if (!(this instanceof LeadController)) return new LeadController(io, musicplayer, connector);

    this._io = io;
    this._musicplayer = musicplayer;
    this._connector = connector;

    this._noteStartQueue = [];
    this._noteStopQueue = [];

    this.registerBeatEvents();
}

/**
 * Called whenever a new socket connects to the server
 * @param socket
 */
LeadController.prototype.registerSocketEvents = function(socket) {
    var _this = this;

    socket.on('start-note', function(note) {
        //console.log("Start note!", note);
        if (!utils.inArray(_this._noteStartQueue, note)) {
            _this._noteStartQueue.push(note);
        }
    });

    socket.on('stop-note', function(note) {
        //console.log("Stop note!", note);
        var index = _this._noteStartQueue.indexOf(note);
        if (index >= 0) {
            // Do not start (stopped before it was ever started)
            _this._noteStartQueue.splice(index, 1);
        } else if (!utils.inArray(_this._noteStopQueue, note)) {
            _this._noteStopQueue.push(note);
        }
    });
};

/**
 * Initiate event listeners on the beat keeper
 */
LeadController.prototype.registerBeatEvents = function() {
    var _this = this;

    this._musicplayer.addListener("beat", function(beatCount) {

        // Stop notes
        // TODO: Check that it is a valid stopping point according to base pattern
        if (_this._noteStopQueue.length > 0) {
            _this._noteStopQueue.forEach(function (note) {
                console.log("Stop note", note);
                _this._connector.send("bass 0.0"); // TODO
            });
            _this._noteStopQueue = [];
        }

        // Start notes
        // TODO: Check that it is a valid starting point
        if (_this._noteStartQueue.length > 0) {
            _this._noteStartQueue.forEach(function (note) {
                console.log("Start note", note);
                _this._connector.send("bass 0.1"); // TODO
            });
            _this._noteStartQueue = [];
        }

        /*if (_this._notePlaying && _this._notePlaying.start + _this._notePlaying.length == beatCount) {
            // Stop note
            _this._connector.send("bass 0.0");
            _this.notePlaying = null;
        } else if (_this._musicplayer.getBaseBlockAt(beatCount)) {
            // Play note
            _this._connector.send("bass 0.1");
            _this._notePlaying = _this._musicplayer.getBaseBlockAt(beatCount);
        }*/
    });
}

module.exports = LeadController;