var utils = require('../music-utils'),
    config = require('../music-config'),
    musicState = require('../music-state'),
    rhythm = require('../rhythm-keeper');

// TODO: Use correct note values + enable notes from chord
var noteMap = [ 52, 55, 57, 60, 62, 64, 67, 69 ];

// Constructor
function LeadController(name, io, musicplayer) {
    if (!(this instanceof LeadController)) return new LeadController(name, io, musicplayer);

    this.name = name;

    this._io = io;
    this._musicplayer = musicplayer;

    this._noteStartQueue = [];
    this._noteStopQueue = [];
    this._noteStopAfterStartedQueue = [];

    this._notesPlaying = {}; // { index-note: midi-note }

    this.registerBeatEvents();
}

/**
 * Called whenever a new socket connects to the server
 * @param socket
 */
LeadController.prototype.registerSocketEvents = function(socket) {
    var _this = this;


    socket.on(this.name + '/start-note', function(note) {
        //console.log("Start note!", note);
        if (!utils.inArray(_this._noteStartQueue, note)) {
            _this._noteStartQueue.push(note);
        }
    });

    socket.on(this.name + '/stop-note', function(note) {
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
        // TODO: Consider what happens if note index is changed!!

        // Stop notes
        if (_this._noteStopQueue.length > 0 && rhythm.isValidEndPoint(beatPosition)) {
            _this._noteStopQueue.forEach(function (note) {
                console.log("Stop note", note, _this._notesPlaying);
                _this._musicplayer.stopNote(_this.name, _this._notesPlaying[note]);
                delete _this._notesPlaying[note];
            });
            _this._noteStopQueue = [];
        }

        if (_this.getConfig().volume <= 0) return; // Muted

        // Start notes
        if (_this._noteStartQueue.length > 0 && rhythm.isValidStartingPoint(beatPosition)) {
            _this._noteStartQueue.forEach(function (note) {
                //console.log("Start note", note);
                if (_this._notesPlaying[note]) {
                    _this._musicplayer.stopNote(_this.name, _this._notesPlaying[note]);
                }
                _this._notesPlaying[note] = musicState.getLeadNote(note);
                console.log("Play note", note, musicState.getLeadNote(note), _this._notesPlaying);
                _this._musicplayer.playNote(_this.name, musicState.getLeadNote(note), _this.getConfig().volume);


            });
            _this._noteStartQueue = [];
            _this._noteStopQueue = _this._noteStopQueue.concat(_this._noteStopAfterStartedQueue);
            _this._noteStopAfterStartedQueue = [];
        }

    });
};

LeadController.prototype.getConfig = function() {
    return config.instrumentConfig[this.name];
};

module.exports = LeadController;