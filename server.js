// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/build'));

var basePattern = [];

io.on('connection', function (socket) {
    console.log("New connection");

    // Send initial state
    socket.emit('update-base-pattern', basePattern);


    // when the client emits 'new message', this listens and executes
    socket.on('some-event', function (data) {
        console.log("Some event", data)
    });

    socket.on('update-base-pattern', function(pattern) {
        console.log("New pattern", pattern);
        basePattern = pattern;
        socket.broadcast.emit('update-base-pattern', pattern);
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        console.log("Disconnected");
    });
});