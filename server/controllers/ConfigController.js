var config = require('../music-config');

// Constructor
function ConfigController(io, musicplayer) {
    if (!(this instanceof ConfigController)) return new ConfigController(io, musicplayer);

    this._io = io;
    this._musicplayer = musicplayer;

}

/**
 * Called whenever a new socket connects to the server
 * @param socket
 */
ConfigController.prototype.registerSocketEvents = function(socket) {
    var _this = this;

    for (var instrument in config.instrumentConfig) {
        socket.emit("adjust-volume", instrument, config.instrumentConfig[instrument].volume);
    }

    socket.on("adjust-volume", function(instrument, volume) {
        //console.log("Adjust volume", instrument, volume);
        config.instrumentConfig[instrument].volume = volume;
        _this._io.emit("adjust-volume", instrument, volume);
    });
}

module.exports = ConfigController;