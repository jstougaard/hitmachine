/// <reference path="../../types/types.ts"/>

class BeatBuilderService implements core.IBeatBuilderService {
    public bpm: number = 128;
    public basePattern: Array<core.RhythmBlock> = null;
    public chordPatterns: Array<Array<core.RhythmBlock>> = null;
    public bassPattern: Array<core.RhythmBlock> = null;
    public drumPatterns: {[drumName:string]:Array<core.RhythmBlock>;} = null;

    public currentProgressionName: string = null;

    /* @ngInject */
    constructor(
        private socket: ng.socketIO.IWebSocket
    ) {
        this.initPatterns();
    }

    private initPatterns() :void {
        this.basePattern = [];
        this.bassPattern = [];
        this.chordPatterns = [ [], [], [], [], [] ];
        this.drumPatterns = {
            "snare": [ {"start": 4, "length": 1}, {"start": 12, "length": 1} ],
            "hihat": [],
            "kick": [ {"start": 0, "length": 1}, {"start": 4, "length": 1}, {"start": 8, "length": 1}, {"start": 12, "length": 1} ]
        };
    }

    public resetPatterns() :void {
        this.initPatterns();
    }

    public apply() :void {
        console.log("BUILD: Apply changes", this.basePattern);
        this.socket.emit("adjust-bpm", this.bpm);
        this.socket.emit("update-base-pattern", this.basePattern);
        this.socket.emit("update-bass-pattern", this.bassPattern);
        this.socket.emit("set-chord-progression", this.currentProgressionName);
        this.socket.emit("update-chord-pattern", this.chordPatterns);

        this.socket.emit("update-drum-pattern", "snare", this.drumPatterns['snare']);
        this.socket.emit("update-drum-pattern", "hihat", this.drumPatterns['hihat']);
        this.socket.emit("update-drum-pattern", "kick", this.drumPatterns['kick']);
    }
}

angular
    .module("core")
    .service("BeatBuilderService", BeatBuilderService);
