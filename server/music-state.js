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


var currentChord = null;
var leadNoteMap = config.leadNoteMap;

module.exports.setCurrentChord = function(chord) {
    currentChord = chord;

    leadNoteMap = this.getLeadNoteMap(chord);
};

module.exports.getCurrentChord = function() {
    return currentChord;
};

module.exports.getCurrentNoteMap = function() {
    return leadNoteMap;
};

module.exports.getLeadNote = function(index) {
    return leadNoteMap[index];
};

module.exports.getLeadNoteMap = function(newChord) {
    // Update current note map
    var leadNotePattern = arrayUnique(config.leadNotePattern.concat( getNotePatternFromNotes(newChord) )).sort();

    var noteMapBelow = generateNoteMapFromPattern(config.leadBaseNote - 12, leadNotePattern);
    var leadNoteMap = noteMapBelow.concat(generateNoteMapFromPattern(config.leadBaseNote, leadNotePattern)).sort();

    // Limit array size
    return leadNoteMap.slice(Math.max(leadNoteMap.length - config.maxLeadTones, 1));
};


