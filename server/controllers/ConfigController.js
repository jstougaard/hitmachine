var config = require('../music-config');

// Constructor
function ConfigController(io, musicplayer) {
    if (!(this instanceof ConfigController)) return new ConfigController(io, musicplayer);

    this._io = io;
    this._musicplayer = musicplayer;

    this._filterValue = 100;
    this.sendFilter();
}

/**
 * Called whenever a new socket connects to the server
 * @param socket
 */
ConfigController.prototype.registerSocketEvents = function(socket) {
    var _this = this;

    socket.emit("adjust-bpm", config.bpm);
    for (var instrument in config.instrumentConfig) {
        socket.emit("adjust-volume", instrument, config.instrumentConfig[instrument].volume);
    }
    socket.emit("adjust-filter-value", this._filterValue);


    socket.on("adjust-bpm", function(bpm) {
        config.bpm = bpm;
        _this._musicplayer.setBPM(bpm);
        _this._io.emit("adjust-bpm", bpm);
    });

    socket.on("adjust-volume", function(instrument, volume) {
        console.log("Adjust volume", instrument, volume);
        if (volume < 5) volume = 0; // Cutoff
        config.instrumentConfig[instrument].volume = volume;
        _this._io.emit("adjust-volume", instrument, volume);
    });

    socket.on("adjust-filter-value", function(value) {
        console.log("Adjust filter", value);
        _this._filterValue = value;
        _this.sendFilter();
        _this._io.emit("adjust-filter-value", value);
    });
};

ConfigController.prototype.sendFilter = function() {
    this._musicplayer.sendMessage("efx filter "+ (this._filterValue/100.0) );
};

module.exports = ConfigController;