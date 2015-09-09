/// <reference path="../../types/types.ts"/>

class MusicService implements core.IMusicService {

    public activeBeat: number = null;
    public isPlaying: boolean = false;

    public basePattern: Array<core.RhythmBlock> = [];
    public chordPatterns: Array<Array<core.RhythmBlock>> = [];
    public bassPattern: Array<core.RhythmBlock> = [];


    public drumPatterns: {[drumName:string]:Array<core.RhythmBlock>;} = {
        "snare": [],
        "hihat": [],
        "kick": []
    };

    public lead: core.IMusicComponentConfig = {
        volume: 100
    };

    public bass: core.IMusicComponentConfig = {
        volume: 100
    };

    public chords: core.IMusicComponentConfig = {
        volume: 100
    };

    public drums: core.IMusicComponentConfig = {
        volume: 100
    };

    private chordTracks: number = 3;  // Define number of chords tracks

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
        this.socket.on("update-base-pattern", this.onNewBasePattern.bind(this));
        this.socket.on("update-chord-pattern", this.onNewChordPattern.bind(this));
        this.socket.on("update-bass-pattern", this.onNewBassPattern.bind(this));
        this.socket.on("update-drum-pattern", this.onNewDrumPattern.bind(this));
        this.socket.on("adjust-volume", this.onAdjustVolume.bind(this));
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

    onAdjustVolume(instrument, volume) {
        this[instrument].volume = volume;
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

    play() {
        this.socket.emit("start-beat", true);
        this.isPlaying = true;
    }

    stop() {
        this.socket.emit("stop-beat", true);
        this.isPlaying = false;
    }

    adjustVolume(instrument) {
        //console.log("Adjust volume", instrument, this[instrument].volume);
        this.socket.emit("adjust-volume", instrument, this[instrument].volume);
    }

}


angular
  .module("core")
  .service("MusicService", MusicService);
