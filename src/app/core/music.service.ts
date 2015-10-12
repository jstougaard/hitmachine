/// <reference path="../../types/types.ts"/>

class MusicService implements core.IMusicService {

    public activeBeat: number = null;
    public isPlaying: boolean = false;
    public bpm: number = 120;

    public currentProgressionId: number = null;

    public songProgressionElements: Array<string> = [];
    public songProgression: Array<string> = [];

    public basePattern: Array<core.RhythmBlock> = [];
    public chordPatterns: Array<Array<core.RhythmBlock>> = [];
    public bassPattern: Array<core.RhythmBlock> = [];

    public chordProgressionNames: Array<string> = [];
    public currentProgressionName: string = null;


    public drumPatterns: {[drumName:string]:Array<core.RhythmBlock>;} = {
        "snare": [],
        "hihat": [],
        "kick": []
    };

    public bass: core.IMusicComponentConfig = {
        volume: 100
    };

    public chords: core.IMusicComponentConfig = {
        volume: 100
    };

    public kick: core.IMusicComponentConfig = {
        volume: 100
    };

    public snare: core.IMusicComponentConfig = {
        volume: 100
    };

    public hihat: core.IMusicComponentConfig = {
        volume: 100
    };

    public filterValue: number = null;

    private numberOfLeads: number = 10;
    private numberOfSounds: number = 127;

    private chordTracks: number = 5;  // Define number of chords tracks

    private currentlyStaged = {};

    /* @ngInject */
    constructor(
        private socket: ng.socketIO.IWebSocket
    ) {

        // Init leads
        for(var j=1;j<=this.numberOfLeads;j++) {
            this["lead" + j] = this.getBaseLeadInstrumentConfig();
            //this["lead" + j].sound = Math.floor(this.numberOfSounds / this.numberOfLeads ) * (j - 1);
        }

        // Init chord pattern tracks
        for(var i=0;i<this.chordTracks;i++) {
            this.chordPatterns.push([]);
        }

        socket.emit("is-web");

        this.registerEvents();
        //$scope.$on('$destroy', this.deRegisterEvents.bind(this));
    }

    getBaseLeadInstrumentConfig() :core.IMusicComponentConfig {
        return {
            volume: 100,
            sound: 0,
            onStage: false,
            isAlive: false
        };
    }

    registerEvents() {
        this.socket.on("start-beat", this.onBeatStarted.bind(this));
        this.socket.on("stop-beat", this.onBeatStopped.bind(this));
        this.socket.on("beat", this.onBeat.bind(this));
        this.socket.on("define-song-progression-elements", this.setSongProgressionElements.bind(this));
        this.socket.on("update-song-progression", this.setSongProgression.bind(this));
        this.socket.on("set-current-progression-id", this.setCurrentProgressionId.bind(this));
        this.socket.on("define-chord-progressions", this.setChordProgressions.bind(this));
        this.socket.on("set-chord-progression", this.setCurrentChordProgression.bind(this));
        this.socket.on("update-base-pattern", this.onNewBasePattern.bind(this));
        this.socket.on("update-chord-pattern", this.onNewChordPattern.bind(this));
        this.socket.on("update-bass-pattern", this.onNewBassPattern.bind(this));
        this.socket.on("update-drum-pattern", this.onNewDrumPattern.bind(this));
        this.socket.on("adjust-bpm", this.onAdjustBPM.bind(this));
        this.socket.on("adjust-volume", this.onAdjustVolume.bind(this));
        this.socket.on("adjust-filter-value", this.onAdjustFilter.bind(this));
        this.socket.on("change-sound", this.onInstrumentSoundChanged.bind(this));
        this.socket.on("selected-for-stage", this.onSelectedForStage.bind(this));
        this.socket.on("device-status-changed", this.onDeviceStatusChanged.bind(this));

    }

    onNewBasePattern(pattern) {
        this.basePattern = pattern;
    }

    onNewChordPattern(patterns) {
        this.chordPatterns = patterns;
    }

    onNewDrumPattern(drumName, pattern) {
        this.drumPatterns[drumName] = pattern;
    }

    onNewBassPattern(pattern) {
        this.bassPattern = pattern;
    }

    onAdjustBPM(bpm) {
        this.bpm = bpm;
    }

    onAdjustVolume(instrument, volume) {
        if (this[instrument]) {
            this[instrument].volume = volume;
        }
    }

    onAdjustFilter(filterValue) {
        this.filterValue = filterValue;
    }

    onInstrumentSoundChanged(instrument, sound) {
        if (this[instrument]) {
            this[instrument].sound = sound;
        }
    }

    onSelectedForStage(playerId, instrumentId) {
        this.currentlyStaged[playerId] = instrumentId;
    }

    onDeviceStatusChanged(instrumentId, isAlive) {
        console.log("Status changed", instrumentId, isAlive);
        this[instrumentId].isAlive = isAlive;
    }

    onBeat(beatNumber) {
        this.activeBeat = beatNumber;
    }

    onBeatStarted() {
        this.isPlaying = true;
    }

    onBeatStopped() {
        this.isPlaying = false;
    }

    setSongProgressionElements(elements: Array<string>) {
        this.songProgressionElements = elements;
    }

    setSongProgression(progression: Array<string>) {
        this.songProgression = progression;
    }

    setCurrentProgressionId(progressionId: number) {
        this.currentProgressionId = progressionId;
    }

    setChordProgressions(progressions: Array<string>) {
        this.chordProgressionNames = progressions;
    }

    setCurrentChordProgression(progressionName: string) {
        this.currentProgressionName = progressionName;
    }

    play() {
        this.socket.emit("start-beat", true);
        this.isPlaying = true;
    }

    stop() {
        this.socket.emit("stop-beat", true);
        this.isPlaying = false;
    }

    bpmChanged() {
        // TODO: Add some event timeout, so it's not changed immediately after each other
        this.socket.emit("adjust-bpm", this.bpm);
    }

    volumeChanged(instrument, newVolume) {
        if (!newVolume) {
            newVolume = this[instrument].volume;
        }
        console.log("Adjust volume", instrument, this[instrument].volume, newVolume);
        this.socket.emit("adjust-volume", instrument, newVolume);
    }

    filterChanged() {
        this.socket.emit("adjust-filter-value", this.filterValue);
    }

    prevInstrumentSound(instrumentName:string) {
        console.log("Prev", instrumentName);
        this[instrumentName].sound--;
        if (this[instrumentName].sound <= 0) {
            this[instrumentName].sound = this.numberOfSounds;
        }
        this.updateInstrumentSound(instrumentName);
    }

    nextInstrumentSound(instrumentName:string) {
        console.log("Next", instrumentName);
        this[instrumentName].sound++;
        if (this[instrumentName].sound > this.numberOfSounds) {
            this[instrumentName].sound = 1;
        }
        this.updateInstrumentSound(instrumentName);
    }

    updateInstrumentSound(instrument) {
        this.socket.emit("change-sound", instrument, this[instrument].sound);
    }

    isOnStage(instrument) {
        for (var index in this.currentlyStaged) {
            if (this.currentlyStaged[index] === instrument) {
                return true;
            }
        }
        return false;
    }

    isDead(instrument) {
        return !this[instrument].isAlive;
    }

}


angular
  .module("core")
  .service("MusicService", MusicService);
