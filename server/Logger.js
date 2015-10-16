var MongoClient = require('mongodb').MongoClient,
    musicState = require('./music-state');

function Logger() {
    this.session = null;
    this.sessionStarted = false;

    this.connected = false;
    this.db = null;

    // Connection URL. This is where your mongodb server is running.
    var url = 'mongodb://localhost:27017/hitmachine';
    this._initMongoConnection(url);
    this.autosaveInterval = 60 * 1000;

    this.collectionName = "session_logs";
}

Logger.prototype.beginSession = function() {
    if (!this.connected) {
        console.log("WARNING: Mongo not connected. Logs wont be saved!");
    }

    if (!this.session) {
        this.initSession();
    }

    if (!this.autosaveTimer) {
        this.autosaveTimer = setInterval(this.saveSession.bind(this), this.autosaveInterval, this.session);
    }
    
    this.sessionStarted = true;
};

Logger.prototype.endSession = function() {
    this.session.end = new Date();
    this.saveSession(this.session);

    if (this.autosaveTimer) {
        clearInterval(this.autosaveTimer);
        this.autosaveTimer = null;
    }

    this.session = null;
    this.sessionStarted = false;
};

Logger.prototype.initSession = function() {
    // Create session object
    this.session = {
        start: new Date(),
        end: null,
        events: {}
    };
};

Logger.prototype.saveSession = function(session) {
    if (this.connected) {

        session.lastSave = new Date();

        this.db.collection(this.collectionName).save(session, function (err) {
            if (err) {
                console.log("Error saving session log", err);
            } else {
                console.log("Session log saved!");
            }
        });

    } else {
        console.log("Couldn't save session log: no connection to DB available");
    }
};

Logger.prototype.isSessionStarted = function() {
    return this.sessionStarted;
};

Logger.prototype.playedNote = function(instrumentName, note, midiNote) {
    if (this.isSessionStarted) {
        this._addEvent("play_note_" + instrumentName, {
            note: note,
            midiNote: midiNote,
            onStage: !musicState.isInstrumentInBuildMode(instrumentName),
            currentChord: musicState.getCurrentChord()
        });
    }
};

Logger.prototype.newInstrumentSound = function(instrumentName, soundId) {
    this._addEvent("change_sound", {
        instrument: instrumentName,
        soundId: soundId,
        onStage: !musicState.isInstrumentInBuildMode(instrumentName)
    });
};

Logger.prototype.addedToStage = function(leadName, positionName) {
    this._addEvent("stage_change", {
        leadName: leadName,
        stageId: positionName,
        action: "ENTER"
    });
};

Logger.prototype.removedFromStage = function(leadName, positionName) {
    this._addEvent("stage_change", {
        leadName: leadName,
        stageId: positionName,
        action: "LEAVE"
    });
};

Logger.prototype.newBasePattern = function(pattern) {
    this._addEvent("base_pattern", {pattern: pattern});
};

Logger.prototype.newBassPattern = function(pattern) {
    this._addEvent("bass_pattern", {pattern: pattern});
};

Logger.prototype.newChordsPattern = function(pattern) {
    this._addEvent("chords_pattern", {pattern: pattern});
};

Logger.prototype.newDrumPattern = function(drumName, pattern) {
    this._addEvent("drum_pattern", {drumName: drumName, pattern: pattern});
};

Logger.prototype.newChordProgression = function(progressionId) {
    this._addEvent("chord_progression", {progressionId: progressionId});
};

Logger.prototype.adjustedBPM = function(newBPM) {
    this._addEvent("bpm", {value: newBPM});
};

Logger.prototype._addEvent = function(eventType, eventData) {
    if (!this.session) {
        this.initSession(); // Should have been done beforehand
    }

    if (!this.session.events[eventType]) {
        this.session.events[eventType] = [];
    }

    eventData['date'] = new Date();
    this.session.events[eventType].push(eventData);
};

Logger.prototype._initMongoConnection = function(url) {
    var _this = this;

    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
            _this.connected = false;
            _this.db = null;
        } else {
            //HURRAY!! We are connected. :)
            console.log('Connection established to', url);
            _this.connected = true;
            _this.db = db;
        }
    });
}


module.exports = new Logger(); // Use instance


