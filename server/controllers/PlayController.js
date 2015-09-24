var utils = require('../music-utils'),
    config = require('../music-config'),
    noteHelper = require('../play-note-helper'),
    rhythm = require('../rhythm-keeper');

// TODO: Use correct note values + enable notes from chord

// Constructor
function PlayController(name, io, musicplayer) {
    if (!(this instanceof PlayController)) return new PlayController(name, io, musicplayer);

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
PlayController.prototype.registerSocketEvents = function(socket) {

    socket.on(this.name + '/start-note', this._onStartNoteRequest.bind(this));

    socket.on(this.name + '/stop-note', this._onStopNoteRequest.bind(this));

};

/**
 * Initiate event listeners on the beat keeper
 */
PlayController.prototype.registerBeatEvents = function() {

    this._musicplayer.addListener("beat", this._onBeat.bind(this));
};

PlayController.prototype._onStartNoteRequest = function(noteName) {

    if (this.isNoteInStartQueue(noteName)) return;


    if (this.isWithinBeatDelay()) {
        console.log("["+this.name+"] Play note now", noteName);
        this.playNote(noteName, true);
    } else {
        console.log("["+this.name+"] Play note on beat!", noteName);
        this._noteStartQueue.push(noteName);
    }

};

PlayController.prototype._onStopNoteRequest = function(noteName) {
    console.log("["+this.name+"] Stop note!", noteName);
    if (this.isNoteInStartQueue(noteName)) {
        // Delay stop - starting when ready
        this._noteStopAfterStartedQueue.push(noteName);
    } else if (!this.isNoteInStopQueue(noteName)) {
        this._noteStopQueue.push(noteName);
    }
};

PlayController.prototype._onBeat = function(beatPosition) {
    // Stop notes
    if (this._noteStopQueue.length > 0 && rhythm.isValidEndPoint(beatPosition)) {
        this.runStopQueue();
    }

    if (this.isMuted()) return; // Muted

    // Start notes
    if (this._noteStartQueue.length > 0 && rhythm.isValidStartingPoint(beatPosition)) {
        this.runStartQueue();
    }
};

PlayController.prototype.isNoteInStartQueue = function(noteName) {
    return utils.inArray(this._noteStartQueue, noteName);
};

PlayController.prototype.isNoteInStopQueue = function(noteName) {
    return utils.inArray(this._noteStopQueue, noteName);
};

PlayController.prototype.runStartQueue = function() {
    this._noteStartQueue.forEach(function (noteName) {

        this.stopNoteIfPlaying(noteName);
        this.playNote(noteName);

    }, this);
    this._noteStartQueue = [];
    this._noteStopQueue = this._noteStopQueue.concat(this._noteStopAfterStartedQueue);
    this._noteStopAfterStartedQueue = [];
};

PlayController.prototype.runStopQueue = function() {
    this._noteStopQueue.forEach(function (note) {
        this.stopNote(note);
    }, this);
    this._noteStopQueue = [];
};

PlayController.prototype.playNote = function(noteName, playImmediately) {
    var note = this.getNote(noteName);
    this._notesPlaying[noteName] = note;

    if (playImmediately) {
        this._musicplayer.playNoteNow(this.name, note, this.getConfig().volume);
    } else {
        this._musicplayer.playNote(this.name, note, this.getConfig().volume);
    }
};

PlayController.prototype.stopNote = function(noteName) {
    this._musicplayer.stopNote(this.name, this._notesPlaying[noteName]);
    delete this._notesPlaying[noteName];
};

PlayController.prototype.stopNoteIfPlaying = function(noteName) {
    if (this.isNotePlaying(noteName)) {
        this.stopNote(noteName);
    }
}

PlayController.prototype.isNotePlaying = function(noteName) {
    return !!this._notesPlaying[noteName];
}

PlayController.prototype.getConfig = function() {
    return config.instrumentConfig[this.name] || {};
};

PlayController.prototype.isMuted = function() {
    return this.getConfig(this.name).volume === 0 || this.getConfig(this.name).muted;
};

PlayController.prototype.isWithinBeatDelay = function() {
    var now = Date.now();
    var margin = Math.round(60 * 1000 / config.bpm / config.notesPerBar * (config.leadDelayMarginPercent / 100) )
    return this._musicplayer.lastBeatTime >= now - margin;
};

PlayController.prototype.getNote = function(noteName) {
  return noteHelper.getNoteToPlay(this.name, noteName);
};

module.exports = PlayController;