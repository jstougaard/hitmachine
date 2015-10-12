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

    for(var stageId in this.currentlyStaged) {
        this.broadcastSelected(stageId, this.currentlyStaged[stageId]);
    }

    socket.on('selected-for-stage', this._onLeadSelected.bind(this));

};

StagingController.prototype._onLeadSelected = function(stageId, instrumentId) {

    if (instrumentId) {
        this._musicplayer.sendMessage(instrumentId + " midiOff");
        this.addToStage(instrumentId, stageId);
    }

    if (this.currentlyStaged[stageId]) {
        this.removeFromStage(this.currentlyStaged[stageId]);
    }

    this.currentlyStaged[stageId] = instrumentId;

    this.broadcastSelected(stageId, instrumentId);
};

StagingController.prototype.addToStage = function(instrumentId, stageId) {
    if (config.instrumentConfig[instrumentId]) {
        config.instrumentConfig[instrumentId].buildMode = false;
        config.instrumentConfig[instrumentId].stageId = stageId;
    }
};

StagingController.prototype.removeFromStage = function(instrumentId) {
    if (config.instrumentConfig[instrumentId]) {
        config.instrumentConfig[instrumentId].buildMode = true;
        config.instrumentConfig[instrumentId].stageId = null;
    }
};

StagingController.prototype.broadcastSelected = function(stageId, instrumentId) {
    this._io.emit('selected-for-stage', stageId, instrumentId);
};

module.exports = StagingController;