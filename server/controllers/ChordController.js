var utils = require('../music-utils'),
    state = require('../music-state');

var chordProgressions = [
    [[ 72, 76, 79, 60, 48 ], [ 67, 71, 74, 55, 43 ], [ 69, 72, 76, 57, 45 ], [ 65,69,72, 53, 41 ]]
];



// Constructor
function ChordController(io, musicplayer, connector) {
    if (!(this instanceof ChordController)) return new ChordController(io, musicplayer, connector);

    this._io = io;
    this._musicplayer = musicplayer;
    this._connector = connector;

    this._currentProgression = 0;
    this._currentChord = 0;

    this._notesPlaying = [];

    this._chordPattern = [];
    this._indexedChordPattern = {};

    this.registerBeatEvents();
}

/**
 * Called whenever a new socket connects to the server
 * @param socket
 */
ChordController.prototype.registerSocketEvents = function(socket) {
    var _this = this;

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

    this._musicplayer.addListener("new-base-pattern", function(pattern) {
        _this._indexedPattern = utils.indexPattern(pattern);
    });

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
    });

    // Play notes
    this._musicplayer.addListener("beat", function(beatCount) {
        // Stop playing notes
        _this._notesPlaying = _this._notesPlaying.filter(function(block) {
            var shouldKeepPlaying = (block.start + block.length < beatCount);
            if (!shouldKeepPlaying) {
                // TODO: Stop note
                console.log("Stop note", block.currentNote);
            }
            return shouldKeepPlaying;
        });

        // Start notes
        if (_this._indexedChordPattern[beatCount]) {
            _this._indexedChordPattern[beatCount].forEach(function(block) {
               // Play note
                block.currentNote = _this._getNoteAtIndex(block.noteIndex);
                // DO PLAY
                console.log("Play note", block.currentNote);
                _this._notesPlaying.push(block);
            });
        }



    });
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