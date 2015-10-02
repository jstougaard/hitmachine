var events = require('events').EventEmitter,
    heartbeats = require('heartbeats'),
    utils = require('./music-utils');


var defaultOptions = {
    bpm: 120,
    noteResolution: 16,
    beatsPerBar: 4
};

// Constructor
function MusicPlayer(connector, options) {
    if (!(this instanceof MusicPlayer)) return new MusicPlayer(connector, options);
    this.setOptions(options);

    this.lastBeatTime = 0;

    this._connector = connector;

    this._heart = null;
    this._beatCount = 0;
    this._beatMessageQueue = [];

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

MusicPlayer.prototype._sendMessageOnBeat = function(message) {
    this._beatMessageQueue.push(message);
};

MusicPlayer.prototype.sendMessage = function(message) {
    this._connector.send(message);
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

    this.sendMessage("midiAllOff");

    this._heart.killAllEvents();
    this._heart.kill();
    this._heart = null;
};


MusicPlayer.prototype.setBPM = function(bpm) {
    this.options.bpm = bpm;
    if (this.isStarted())
        this._heart.setHeartrate( this._getHeartBeatIntervalTime() );
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