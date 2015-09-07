var utils = require('../music-utils'),
    state = require('../music-state'),
    rhythm = require('../rhythm-keeper');

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
    this._noteStopAfterStartedQueue = [];

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
            //_this._noteStartQueue.splice(index, 1);
            // Delay stop - starting when ready
            _this._noteStopAfterStartedQueue.push(note);
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

    this._musicplayer.addListener("beat", function(beatPosition) {

        // Stop notes
        // TODO: Check that it is a valid stopping point according to base pattern
        if (_this._noteStopQueue.length > 0 && rhythm.isValidEndPoint(beatPosition)) {
            _this._noteStopQueue.forEach(function (note) {
                console.log("Stop note", note);
                _this._connector.send("bass 0.0"); // TODO
            });
            _this._noteStopQueue = [];
        }

        // Start notes
        // TODO: Should start be delayed if not immediately available?
        if (_this._noteStartQueue.length > 0 && rhythm.isValidStartingPoint(beatPosition)) {
            _this._noteStartQueue.forEach(function (note) {
                console.log("Start note", note);
                _this._connector.send("bass 0.1"); // TODO
            });
            _this._noteStartQueue = [];
            _this._noteStopQueue = _this._noteStopQueue.concat(_this._noteStopAfterStartedQueue);
            _this._noteStopAfterStartedQueue = [];
        }

    });
}

module.exports = LeadController;