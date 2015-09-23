

var controllerBasePath = "./controllers";
var controllers = [
    "ConfigController",
    "ProgressionController",
    "RhythmController",
    "BassController",
    "DrumsController",
    "ChordController",
    "PadsController",
    ["PlayController", "lead"],
    ["PlayController", "lead2"],
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