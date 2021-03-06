

var controllerBasePath = "./controllers";
var controllers = [
    "ConfigController",
    "StagingController",
    "HealthController",
    "ProgressionController",
    "RhythmController",
    "BassController",
    "DrumsController",
    "ChordController",
    "PadsController",
    ["PlayController", "lead1"],
    ["PlayController", "lead2"],
    ["PlayController", "lead3"],
    ["PlayController", "lead4"],
    ["PlayController", "lead5"],
    ["PlayController", "lead6"],
    ["PlayController", "lead7"],
    ["PlayController", "lead8"],
    ["PlayController", "lead9"],
    ["PlayController", "lead10"],
    ["PlayController", "chords"],
    ["PlayController", "bass"],
    ["PlayController", "drums"],
];

// Constructor
function SocketRouter(io, musicplayer) {
    if (!(this instanceof SocketRouter)) return new SocketRouter(io, musicplayer);

    this._io = io;
    this._musicplayer = musicplayer;

    this._controllers = [];
    this.initControllers(io, musicplayer);
};

SocketRouter.prototype.initControllers = function(io, musicplayer) {


    controllers.forEach(function(controller) {
        var arguments = [io, musicplayer];

        if (Array.isArray(controller)) {
            var additionalArgs = controller;
            controller = additionalArgs.shift();
            arguments = additionalArgs.concat(arguments);
        }

        var controllerClass = require(controllerBasePath + '/' + controller);
        this._controllers.push( controllerClass.apply(this, arguments) );

    }, this);
};

/**
 * Called whenever a new socket connects to the server
 * @param socket
 */
SocketRouter.prototype.registerSocketEvents = function(socket) {

    this._controllers.forEach(function(controller) {
        controller.registerSocketEvents(socket);
    });

};

module.exports = SocketRouter;