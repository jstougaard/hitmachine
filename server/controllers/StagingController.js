var config = require('../music-config');

// Constructor
function StagingController(io, musicplayer) {
    if (!(this instanceof StagingController)) return new StagingController(io, musicplayer);

    this._io = io;
    this._musicplayer = musicplayer;

    this.currentlyStaged = {};
}

/**
 * Called whenever a new socket connects to the server
 * @param socket
 */
StagingController.prototype.registerSocketEvents = function(socket) {

    for(var playerId in this.currentlyStaged) {
        this.broadcastSelected(playerId, this.currentlyStaged[playerId]);
    }

    socket.on('selected-for-stage', this._onLeadSelected.bind(this));

};

StagingController.prototype._onLeadSelected = function(playerId, instrumentId) {

    if (instrumentId) {
        this._musicplayer.sendMessage(instrumentId + " midiOff");
        this.addToStage(instrumentId);
    }

    if (this.currentlyStaged[playerId]) {
        this.removeFromStage(this.currentlyStaged[playerId]);
    }

    this.currentlyStaged[playerId] = instrumentId;

    this.broadcastSelected(playerId, instrumentId);
};

StagingController.prototype.addToStage = function(instrumentId) {
    if (config.instrumentConfig[instrumentId]) {
        config.instrumentConfig[instrumentId].buildMode = false;
    }
};

StagingController.prototype.removeFromStage = function(instrumentId) {
    if (config.instrumentConfig[instrumentId]) {
        config.instrumentConfig[instrumentId].buildMode = true;
    }
};

StagingController.prototype.broadcastSelected = function(playerId, instrumentId) {
    this._io.emit('selected-for-stage', playerId, instrumentId);
};

module.exports = StagingController;