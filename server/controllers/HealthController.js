var config = require('../music-config');

// Constructor
function HealthController(io, musicplayer) {
    if (!(this instanceof HealthController)) return new HealthController(io, musicplayer);

    this._io = io;
    this._musicplayer = musicplayer;

    this.pingInterval = 1000;
    this.intervalTimer = null;
}

/**
 * Called whenever a new socket connects to the server
 * @param socket
 */
HealthController.prototype.registerSocketEvents = function(socket) {
    if (!this.isPinging()) {
        this.startPinging();
    }
};

HealthController.prototype.startPinging = function() {
    this.intervalTimer = setInterval(this.doPing, this.pingInterval);
};

HealthController.prototype.doPing = function() {
  this._io.emit("ping");
};

HealthController.prototype.stopPinging = function() {
    clearInterval(this.intervalTimer);
    this.intervalTimer = null;
};

HealthController.prototype.isPinging = function() {
    return this.intervalTimer !== null;
};

module.exports = HealthController;