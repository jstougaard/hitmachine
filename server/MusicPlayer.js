var events = require('events').EventEmitter,
    heartbeats = require('heartbeats'),
    utils = require('./music-utils'),
    musicState = require('./music-state');


var defaultOptions = {
    bpm: 120,
    noteResolution: 16,
    beatsPerBar: 4
};

// Constructor
function MusicPlayer(stageConnector, buildConnector, options) {
    if (!(this instanceof MusicPlayer)) return new MusicPlayer(stageConnector, buildConnector, options);
    this.setOptions(options);

    this.lastBeatTime = 0;

    this._stageConnector = stageConnector;
    this._buildConnector = buildConnector;

    this._heart = null;
    this._beatCount = 0;
    this._beatMessageQueue = [];

    this.sendBpmOptions(this.options.bpm);

    this.setMaxListeners(20);
}

// Extend EventEmitter
MusicPlayer.prototype = Object.create(events.prototype);


MusicPlayer.prototype.setOptions = function(options){
    if (!this.options)
        this.options = defaultOptions;

    for (var key in options){
        this.options[key] = options[key];
    }

    return this;
};



MusicPlayer.prototype.playNote = function(instrument, note, volume) {
    if (!volume) volume = 100;

    this._sendMessageOnBeat(instrument + " note " + note  + " " + volume);
};

MusicPlayer.prototype.stopNote = function(instrument, note) {
    this._sendMessageOnBeat(instrument + " note " + note + " 0"); // Zero volume = OFF
};

MusicPlayer.prototype.playNoteNow = function(instrument, note, volume) {
    if (!volume) volume = 100;

    this.sendMessage(instrument + " note " + note  + " " + volume);
};

MusicPlayer.prototype.changeSound = function(instrument, newSound) {
    this.sendMessage(instrument + " midiOff");
    this.sendMessage(instrument + " changeProgram " + newSound);
};

MusicPlayer.prototype._sendMessageOnBeat = function(message) {
    this._beatMessageQueue.push(message);
};

MusicPlayer.prototype.sendMessage = function(message) {
    var instrument = this._getInstrumentFromMessage(message);
    if (this._buildConnector && musicState.isInstrumentInBuildMode(instrument)) {
        this.sendBuildMessage(message);
    } else {
        this.sendStageMessage( this._convertToStageMessage(instrument, message) );
    }
};

MusicPlayer.prototype.sendBuildMessage = function(message) {
    this._buildConnector.send(message);
};

MusicPlayer.prototype.sendStageMessage = function(message) {
    this._stageConnector.send(message);
};

MusicPlayer.prototype._getInstrumentFromMessage = function(message) {
    var i = message.indexOf(' ');
    if (i !== -1) {
        return message.substring(0, i);
    }
    return message;
};

MusicPlayer.prototype._convertToStageMessage = function(instrument, message) {
    var stageId = musicState.getStageInstrumentStageId(instrument);
    if (stageId !== instrument) {
        return message.replace(instrument, stageId);
    }
    return message;
};

MusicPlayer.prototype.start = function() {

    // Create heart for keeping time
    this._heart = heartbeats.createHeart( this._getHeartBeatIntervalTime() );

    // Listen to heartbeats - listen to every pulse
    this._heart.createEvent(1, onBeat.bind(this));

};

MusicPlayer.prototype.isStarted = function() {
    return this._heart !== null;
};


MusicPlayer.prototype.stop = function() {
    if (!this.isStarted()) return;

    this.sendBuildMessage("midiAllOff");
    this.sendStageMessage("midiAllOff");

    this._heart.killAllEvents();
    this._heart.kill();
    this._heart = null;
};


MusicPlayer.prototype.setBPM = function(bpm) {
    this.options.bpm = bpm;
    this.sendBpmOptions(bpm);
    if (this.isStarted())
        this._heart.setHeartrate( this._getHeartBeatIntervalTime() );
};

MusicPlayer.prototype.sendBpmOptions = function(bpm) {
    var bpmValue = ((bpm - 30) / 210).toFixed(6);
    this.sendStageMessage("bpm "+bpmValue);
};

MusicPlayer.prototype._getHeartBeatIntervalTime = function() {
    return Math.round(60*1000 / this.options.bpm / (this.options.noteResolution/this.options.beatsPerBar) );
};


// Event callback - only works if bind(this)
function onBeat() {

    if (this._beatCount === 0) {
        this.emit("loop", true); // Beginning of new loop
    }

    if (this._beatCount % this.beatsPerBar === 0) {
        this.emit("bar"); // Beginning of new bar
    }

    // Emit event
    this.emit('beat', this._beatCount);

    // Send beat queue messages
    for(var i=0; i < this._beatMessageQueue.length; i++) {
        this.sendMessage( this._beatMessageQueue[i] );
    }
    this._beatMessageQueue = [];

    this.lastBeatTime = Date.now();

    // Increment count
    this._beatCount++;
    if (this._beatCount >= this.options.noteResolution) {
        this._beatCount = 0;
    }
}

module.exports = MusicPlayer;