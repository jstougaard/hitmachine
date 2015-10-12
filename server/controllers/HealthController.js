var config = require('../music-config');

// Constructor
function HealthController(io, musicplayer) {
    if (!(this instanceof HealthController)) return new HealthController(io, musicplayer);

    this._io = io;
    this._musicplayer = musicplayer;

    this.pingInterval = 1000;
    this.intervalTimer = null;

    this.devicesAlive = [];
    this.receivedPong = [];
}

/**
 * Called whenever a new socket connects to the server
 * @param socket
 */
HealthController.prototype.registerSocketEvents = function(socket) {
    if (!this.isPinging()) {
        this.startPinging();
    }

    this.devicesAlive.forEach(function(instrument) {
        socket.emit("device-status-changed", instrument, true);
    });

    socket.on("pong", this.onPong.bind(this));
};

HealthController.prototype.startPinging = function() {
    this.intervalTimer = setInterval(this.doPing.bind(this), this.pingInterval);
};

HealthController.prototype.doPing = function() {
    this.checkForDead();
    this._io.emit("ping");
};

HealthController.prototype.stopPinging = function() {
    clearInterval(this.intervalTimer);
    this.intervalTimer = null;
};

HealthController.prototype.isPinging = function() {
    return this.intervalTimer !== null;
};

HealthController.prototype.onPong = function(instrument) {
    this.setIsAlive(instrument);
    this.receivedPong.push(instrument);
};


HealthController.prototype.checkForDead = function() {
    var deadDevices = [];
    this.devicesAlive.forEach(function(instrument) {
        if (this.receivedPong.indexOf(instrument) === -1) {
            deadDevices.push(instrument);
        }
    }, this);

    deadDevices.forEach(function(instrument) {
        this.setIsDead(instrument);
    }, this);

    this.receivedPong = [];
}

HealthController.prototype.setIsAlive = function(instrument) {
    if (this.devicesAlive.indexOf(instrument) === -1) {
        this.devicesAlive.push(instrument);
        this._io.emit("device-status-changed", instrument, true);
    }
};

HealthController.prototype.setIsDead = function(instrument) {
    var index = this.devicesAlive.indexOf(instrument);
    if (index !== -1) {
        this.devicesAlive.splice(index, 1);
        this._io.emit("device-status-changed", instrument, false);
    }
};

module.exports = HealthController;