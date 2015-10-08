var config = require('../music-config');

// Constructor
function HealthController(io, musicplayer) {
    if (!(this instanceof HealthController)) return new HealthController(io, musicplayer);

    this._io = io;
    this._musicplayer = musicplayer;

    this.pingInterval = 1000;

    this.startPinging();
}

/**
 * Called whenever a new socket connects to the server
 * @param socket
 */
HealthController.prototype.registerSocketEvents = function(socket) {

};

HealthController.prototype.startPinging = function() {
    return setInterval(this.doPing, this.pingInterval);
};

HealthController.prototype.doPing = function() {
  this._io.emit("ping");
};

module.exports = HealthController;