/// <reference path="../../types/types.ts"/>

class MusicService implements core.IMusicService {

    public activeBeat: number = null;
    public isPlaying: boolean = false;

    public basePattern: Array<core.RhythmBlock> = [];
    public chordPatterns: Array<Array<core.RhythmBlock>> = [];

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
        this.socket.on("beat", this.onBeat.bind(this));
        this.socket.on("update-base-pattern", this.onNewBasePattern.bind(this));
    }

    onNewBasePattern(pattern) {
        this.basePattern = pattern;
    }

    onBeat(beatNumber) {
        this.activeBeat = beatNumber;
    }

    play() {
        this.socket.emit("start-beat", true);
        this.isPlaying = true;
    }

    stop() {
        this.socket.emit("stop-beat", true);
        this.isPlaying = false;
    }

}


angular
  .module("core")
  .service("MusicService", MusicService);
