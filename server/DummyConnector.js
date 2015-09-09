/**
 * DummyConnector class for sending messages to pure data
 */
function DummyConnector() {
    if (!(this instanceof DummyConnector)) return new DummyConnector();
}

DummyConnector.prototype.connect = function() {
    // I don't do shit
};

DummyConnector.prototype.send = function(message){
    console.log("[DummyConnector]", message);
};

DummyConnector.prototype.close = function(){
    // Dummy
};

module.exports = DummyConnector;