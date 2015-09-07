/**
 * Global - cause it's easier
 */

var config = require('./music-config');

// Private variables
var basePattern = [];
var indexedBasePattern = [];

// Public
module.exports = {

    setBasePattern: function(pattern) {
        basePattern = pattern;
        indexedBasePattern = this.indexPattern(pattern);
    },

    getBasePattern: function() {
        return basePattern;
    },

    getIndexedBasePattern: function() {
        return indexedBasePattern;
    },

    getBaseBlockAt: function(beatNumber) {
        return this.getIndexedBasePattern()[beatNumber] || null;
    },

    indexPattern: function(pattern) {
        var indexed = {};
        pattern.forEach(function(val) {
            indexed[val.start] = val;
        });
        return indexed;
    },

    isWithinPatternBlock: function(beatPosition, block) {
        return block.start <= beatPosition && block.start + block.length > beatPosition;
    },

    getRhythmBlockAtPosition: function(beatPosition) {
        var _this = this,
            existingBlock = null;

        basePattern.forEach(function(block) {
            if (_this.isWithinPatternBlock(beatPosition, block)) {
                existingBlock = block;
            }
        });
        return existingBlock;
    },

    isBeatPositionWithinRhythm: function(beatPosition) {
        return this.getRhythmBlockAtPosition(beatPosition) ? true : false;
    },

    isValidStartingPoint: function(beatPosition) {
        if (!basePattern || basePattern.length === 0) return true; // If base pattern is not defined, everything is playable

        return this.isBeatPositionWithinRhythm(beatPosition);
    },

    isValidEndPoint: function(beatPosition) {
        if (!basePattern || basePattern.length === 0) return true;  // If base pattern is not defined, everything is playable

        // Valid if within rhythm or next beat is on rhythm
        return this.isBeatPositionWithinRhythm(beatPosition) || this.isBeatPositionWithinRhythm( (beatPosition - 1) % config.noteResolution );
    }

}