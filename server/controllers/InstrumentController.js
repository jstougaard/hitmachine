var utils = require('../music-utils'),
    musicState = require('../music-state'),
    config = require('../music-config');


// Constructor
function InstrumentController(io, musicplayer) {
    if (!(this instanceof InstrumentController)) return new InstrumentController(io, musicplayer);


    this._io = io;
    this._musicplayer = musicplayer;


    this.registerBeatEvents();
}

/**
 * Called whenever a new socket connects to the server
 * @param socket
 */
InstrumentController.prototype.registerSocketEvents = function(socket) {
    var _this = this;



};

module.exports = InstrumentController;