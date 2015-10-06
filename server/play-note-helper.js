var musicState = require('./music-state'),
    musicConfig = require('./music-config');

var getNoteIndexFromName = function(noteName) {
    return parseInt(noteName, 10) - 1;
}

var getLeadNote = function(noteName) {
    return musicState.getCurrentLeadNoteMap()[getNoteIndexFromName(noteName)];
};

var getChordNote = function(noteName) {
    console.log("GetChordNote", musicState.getCurrentChord(), noteName);
    return musicState.getCurrentChord()[getNoteIndexFromName(noteName)];
};

var getBassNote = function(noteName) {
    return musicState.getCurrentChord()[getNoteIndexFromName(noteName)];
};

var getDrumNote = function(drumName) {
    return musicConfig.instrumentConfig[drumName].note;
};

var noteStrategies = {
    "lead": getLeadNote,
    "chords": getChordNote,
    "bass": getBassNote,
    "drums": getDrumNote
};


module.exports.getNoteToPlay = function(name, noteName) {
    if (name.indexOf("lead") === 0) {
        name = "lead";
    }

    if (typeof noteStrategies[name] !== "undefined") {
        return noteStrategies[name](noteName);
    }
};