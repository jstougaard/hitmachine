var net = require('net');
var client = new net.Socket();


/**
 * TcpConnector class for sending messages to pure data
 */
function TcpConnector(port, host) {
    if (!(this instanceof TcpConnector)) return new TcpConnector(port, host);
    this.port = port;
    this.host = host || '127.0.0.1';
    this.isConnected = false;

    this.client = new net.Socket();
    this.connect();
}

TcpConnector.prototype.connect = function() {
    var _this = this;

    this.client.on('error', function(err) {
        console.log("TcpConnector error! Make sure you have a server running on "+_this.host+":"+_this.port);
    });
    this.client.on('close', function() {
        console.log("TcpConnector is not longer connected");
        _this.isConnected = false;
    });
    this.client.on('connect', function() {
        console.log("TcpConnector is connected");
        _this.isConnected = true;
    });

    this.client.connect(this.port, this.host);

};

TcpConnector.prototype.send = function(message){
    if (!this.isConnected) {
        console.log("TcpConnector not connected");
        return;
    }

    //console.log("Write TCP message to "+this.host+":"+this.port+": "+message);
    this.client.write(message + ";\r\n");
};

TcpConnector.prototype.close = function(){
    this.client.end();
    this.isConnected = false;
};

module.exports = TcpConnector;