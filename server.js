// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

//var connector = require('./server/DummyConnector')();
//var connector = require('./server/TcpConnector')(7778);
var connector = require('./server/UdpConnector')(8051);

var musicplayer = require('./server/MusicPlayer')(connector);
var router = require('./server/router')(io, musicplayer);




server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/build'));

//beatkeeper.start();

io.on('connection', function (socket) {
    console.log("New connection");

    router.registerSocketEvents(socket);

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        console.log("Disconnected");
    });
});

process.on('uncaughtException', function (err) {
    console.log("Uncaught Exception", err);
    console.log(err.stack);
});