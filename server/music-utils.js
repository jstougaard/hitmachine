/**
 * Index pattern on starting point
 * @param pattern
 * @returns {{}}
 */
module.exports.indexPattern = function(pattern) {
    var indexedPattern = {};
    pattern.forEach(function(val) {
        indexedPattern[val.start] = val;
    });
    return indexedPattern;
};

module.exports.inArray = function(array, value) {
    return array.indexOf(value) !== -1;
}