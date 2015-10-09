var config = require('../music-config');

// Constructor
function ConfigController(io, musicplayer) {
    if (!(this instanceof ConfigController)) return new ConfigController(io, musicplayer);

    this._io = io;
    this._musicplayer = musicplayer;

    this._filterValue = 100;
    this.initLeadConfigs();
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

        if (config.instrumentConfig[instrument].sound) {
            socket.emit("change-sound", instrument, config.instrumentConfig[instrument].sound);

        }
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

    socket.on("change-sound", function(instrument, sound) {
        console.log("Change sound", instrument, sound);
        config.instrumentConfig[instrument].sound = sound;

        _this._musicplayer.changeSound(instrument, sound);

        _this._io.emit("change-sound", instrument, sound);
    });

    socket.on("adjust-filter-value", function(value) {
        console.log("Adjust filter", value);
        _this._filterValue = value;
        _this.sendFilter();
        _this._io.emit("adjust-filter-value", value);
    });
};

ConfigController.prototype.initLeadConfigs = function() {
    for (var i = 1; i <= config.numberOfLeads; i++) {
        config.instrumentConfig["lead" + i] = {
            volume: 100,
            muted: false,
            sound: Math.floor(config.numberOfLeadSounds / config.numberOfLeads ) * (i - 1) + 1,
            buildMode: true
        };
    }
}

ConfigController.prototype.sendFilter = function() {
    this._musicplayer.sendMessage("efx filter "+ (this._filterValue/100.0) );
};

module.exports = ConfigController;