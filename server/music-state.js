/**
 * Keep shared state here !!
 * @type {string}
 */
var config = require('./music-config');

function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

function generateNoteMapFromPattern(baseNote, pattern) {
  return pattern.map(function(val) {
     return baseNote + val - 1;
  });
};

function getNotePatternFromNotes(notes) {
  return arrayUnique(notes.map(function(note) {
    return (note % 12) + 1; // E.g. 60 becomes 1
  }));
};

function sortNumber(a,b) {
    return a - b;
};

function generateLeadNoteMap(newChord) {
    // Update current note map
    var leadNotePattern = arrayUnique(config.leadNotePattern.concat( getNotePatternFromNotes(newChord) )).sort(sortNumber);


    var noteMap = generateNoteMapFromPattern(config.leadBaseNote, leadNotePattern);
    var noteMapAbove = generateNoteMapFromPattern(config.leadBaseNote + 12, leadNotePattern);
    var noteMapTwoAbove = generateNoteMapFromPattern(config.leadBaseNote + 24, leadNotePattern);
    var noteMapThreeAbove = generateNoteMapFromPattern(config.leadBaseNote + 36, leadNotePattern);

    var leadNoteMap = noteMap.concat(noteMap, noteMapAbove, noteMapTwoAbove, noteMapThreeAbove);

    // Limit array size
    //return leadNoteMap.slice(Math.max(leadNoteMap.length - config.maxLeadTones, 1));
    return leadNoteMap.slice(0, 18);
};


var currentChord = null;
var leadNoteMap = generateLeadNoteMap([]);

module.exports.setCurrentChord = function(chord) {
    currentChord = chord;

    leadNoteMap = generateLeadNoteMap(chord);
};

module.exports.getCurrentChord = function() {
    return currentChord;
};

module.exports.getCurrentLeadNoteMap = function() {
    return leadNoteMap;
};

var songProgression = [];
module.exports.setCurrentSongProgression = function(progression) {
    var maxId = 0;
    // Create objects and find max id
    songProgression = progression.map(function(elem) {
        if (typeof elem.id === "undefined") {
            return { name: elem, id: null };
        } else {
            maxId = Math.max(maxId, elem.id);
            return elem;
        }
    });

    // Set ids
    var nextId = maxId + 1;
    songProgression = songProgression.map(function(elem) {
        if (elem.id === null) {
            elem.id = nextId;
            nextId++;
        }
        return elem;
    });
};
module.exports.getCurrentSongProgression = function() {
    return songProgression;
};

/**
 * Determine whether the instrument is in build mode - default is false
 * @param instrumentName
 * @returns {boolean}
 */
module.exports.isInstrumentInBuildMode = function(instrumentName) {
    return config.instrumentConfig[instrumentName] && config.instrumentConfig[instrumentName].buildMode ? true : false;
};

module.exports.getStageInstrumentStageId = function(instrumentName) {
    if (config.instrumentConfig[instrumentName] && config.instrumentConfig[instrumentName].stageId) {
        return config.instrumentConfig[instrumentName].stageId;
    }
    return instrumentName;
};



