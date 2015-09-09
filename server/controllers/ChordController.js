var utils = require('../music-utils'),
    musicState = require('../music-state'),
    config = require('../music-config');

var chordProgressions = [
    [[ 72, 76, 79, 60, 48 ], [ 67, 71, 74, 55, 43 ], [ 69, 72, 76, 57, 45 ], [ 65,69,72, 53, 41 ]]
];



// Constructor
function ChordController(io, musicplayer) {
    if (!(this instanceof ChordController)) return new ChordController(io, musicplayer);

    this.name = "chords";

    this._io = io;
    this._musicplayer = musicplayer;

    this._currentProgression = 0;
    this._currentChord = 0;

    this._notesPlaying = [];

    this._chordPattern = [ [], [], [] ];
    this._indexedChordPattern = {};

    this.registerBeatEvents();
}

/**
 * Called whenever a new socket connects to the server
 * @param socket
 */
ChordController.prototype.registerSocketEvents = function(socket) {
    var _this = this;

    // Init pattern
    socket.emit('update-chord-pattern', _this._chordPattern);

    socket.on('update-chord-pattern', function(pattern) {

        _this._chordPattern = pattern; // TODO: Only do this at beginning of loop ?
        _this._indexedChordPattern = indexChordPatterns(_this._chordPattern);

        console.log("New chord pattern", pattern, _this._indexedChordPattern);


        _this._io.emit('update-chord-pattern', pattern); // Send to all clients
    });

};

/**
 * Initiate event listeners on the beat keeper
 */
ChordController.prototype.registerBeatEvents = function() {
    var _this = this;

    // Track current chord
    var firstLoop = true;
    this._musicplayer.addListener("loop", function() {
        if (!firstLoop) {
            _this._currentChord++;
            if (_this._currentChord >= chordProgressions[_this._currentProgression].length) {
                _this._currentChord = 0;
            }
        } else {
            firstLoop = false;
        }

        musicState.currentChord = chordProgressions[_this._currentProgression][_this._currentChord];
    });

    // Play notes
    this._musicplayer.addListener("beat", function(beatCount) {
        // Stop playing notes
        _this._notesPlaying = _this._notesPlaying.filter(function(block) {
            var shouldKeepPlaying = (block.start + block.length > beatCount && beatCount > block.start);
            if (!shouldKeepPlaying) {
                // TODO: Stop note
                //console.log("Stop note", block.currentNote);
                _this._musicplayer.stopNote(_this.name, block.currentNote);
            }
            return shouldKeepPlaying;
        });

        if (_this.getConfig().volume <= 0) return; // Muted

        // Start notes
        if (_this._indexedChordPattern[beatCount]) {
            _this._indexedChordPattern[beatCount].forEach(function(block) {
               // Play note
                block.currentNote = _this._getNoteAtIndex(block.noteIndex);
                // DO PLAY
                //console.log("Play note", block.currentNote);
                _this._musicplayer.playNote(_this.name, block.currentNote, _this.getConfig().volume);
                _this._notesPlaying.push(block);
            });
        }

    });
};

ChordController.prototype.getConfig = function() {
    return config.instrumentConfig[this.name];
};

ChordController.prototype._getNoteAtIndex = function(noteIndex) {
  //console.log("Get note", chordProgressions[this._currentProgression][this._currentChord]);
    return   chordProgressions[this._currentProgression][this._currentChord][noteIndex]; // TODO: Add sanity check
};

function indexChordPatterns(patterns) {
    var indexedPattern = {};
    patterns.forEach(function(pattern, noteIndex) {
        pattern.forEach(function(block) {
            block.noteIndex = noteIndex;
            if (!indexedPattern[block.start]) {
                indexedPattern[block.start] = [];
            }
            indexedPattern[block.start].push(block);
        });
    });
    return indexedPattern;
};

module.exports = ChordController;