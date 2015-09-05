// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var musicplayer = require('./server/MusicPlayer')(),
    connector = require('./server/TcpConnector')(7778),
    rhythmController = require('./server/controllers/RhythmController')(io, musicplayer),
    bassController = require('./server/controllers/BassController')(io, musicplayer, connector),
    chordController = require('./server/controllers/ChordController')(io, musicplayer, connector);


server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/build'));

//beatkeeper.start();

io.on('connection', function (socket) {
    console.log("New connection");

    rhythmController.registerSocketEvents(socket);
    bassController.registerSocketEvents(socket);
    chordController.registerSocketEvents(socket);

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        console.log("Disconnected");
    });
});

process.on('uncaughtException', function (err) {
    console.log(err);
});