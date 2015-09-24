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

    public lead: core.IMusicComponentConfig = {
        volume: 100
    };

    public lead2: core.IMusicComponentConfig = {
        volume: 100
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

    private chordTracks: number = 5;  // Define number of chords tracks

    /* @ngInject */
    constructor(
        private socket: ng.socketIO.IWebSocket
    ) {

        // Init chord pattern tracks
        for(var i=0;i<this.chordTracks;i++) {
            this.chordPatterns.push([]);
        }

        this.registerEvents();
        //$scope.$on('$destroy', this.deRegisterEvents.bind(this));
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

}


angular
  .module("core")
  .service("MusicService", MusicService);
