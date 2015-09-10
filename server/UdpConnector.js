var dgram = require('dgram');
var socket;

/**
 * UdpConnector class for sending messages to pure data
 */
function UdpConnector(port, host) {
    if (!(this instanceof UdpConnector)) return new UdpConnector(port, host);
    this.port = port;
    this.host = host || '127.0.0.1';

    this.isConnected = false;
    this.connect();
}

UdpConnector.prototype.connect = function() {
    var _this = this;

    this.client = dgram.createSocket('udp4');

    this.client.on('error', function(err) {
        console.log("UdpConnector error! Make sure you have a server running on "+_this.host+":"+_this.port);
        _this.isConnected = false;
    });
    this.client.on('close', function() {
        console.log("UdpConnector is not longer connected");
        _this.isConnected = false;
    });

    this.isConnected = true;
}

UdpConnector.prototype.send = function(messageString){
    if (!this.isConnected) {
        console.log("UdpConnector not connected");
        return;
    }

    var message = new Buffer(messageString);
    var port = this.port;
    var host = this.host;

    this.client.send(message, 0, message.length, port, host, function(err, bytes) {
        if (err) throw err;
        //console.log('UDP message sent to ' + host +':'+ port, messageString);
        //client.close(); // Do not close yet
    });
};

UdpConnector.prototype.close = function(){
    this.client.close();
    this.client = null;
    this.isConnected = false;
};

module.exports = UdpConnector;