// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var beatkeeper = require('./server/BeatKeeper')(),
    connector = require('./server/TcpConnector')(7778),
    rhythmController = require('./server/controllers/RhythmController')(io, beatkeeper),
    bassController = require('./server/controllers/BassController')(io, beatkeeper, connector);


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

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        console.log("Disconnected");
    });
});