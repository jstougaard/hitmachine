var events = require('events').EventEmitter,
    heartbeats = require('heartbeats'),
    utils = require('./music-utils');


var defaultOptions = {
    bpm: 120,
    noteResolution: 16,
    beatsPerBar: 4
};

// Constructor
function MusicPlayer(options) {
    if (!(this instanceof MusicPlayer)) return new MusicPlayer(options);
    this.setOptions(options);

    this._heart = null;
    this._beatCount = 0;
    this._basePattern = [];
    this._indexedBasePattern = [];
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

    // Increment count
    this._beatCount++;
    if (this._beatCount >= this.options.noteResolution) {
        this._beatCount = 0;
    }
}

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

module.exports = MusicPlayer;