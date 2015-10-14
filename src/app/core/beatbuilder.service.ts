/// <reference path="../../types/types.ts"/>

class BeatBuilderService implements core.IBeatBuilderService {
    public bpm: number = 128;
    public basePattern: Array<core.RhythmBlock> = null;
    public chordPatterns: Array<Array<core.RhythmBlock>> = null;
    public bassPattern: Array<core.RhythmBlock> = null;
    public drumPatterns: {[drumName:string]:Array<core.RhythmBlock>;} = null;

    public currentProgressionName: string = null;

    public soundSettings = {
        bass: 1,
        chords: 1,
        snare: 1,
        pads:1,
        kick: 1,
        hihat: 1
    }

    /* @ngInject */
    constructor(
        private socket: ng.socketIO.IWebSocket,
        private MusicService: core.IMusicService
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
        console.log("BUILD: Apply changes", this.soundSettings);

        // Send sounds
        for (var instrument in this.soundSettings) {
            if (this.soundSettings.hasOwnProperty(instrument)) {
                this.socket.emit("change-sound", instrument, this.soundSettings[instrument]);
            }
        }


        this.socket.emit("adjust-bpm", this.bpm);
        this.socket.emit("update-base-pattern", this.basePattern);
        this.socket.emit("update-bass-pattern", this.bassPattern);
        this.socket.emit("set-chord-progression", this.currentProgressionName);
        this.socket.emit("update-chord-pattern", this.chordPatterns);

        this.socket.emit("update-drum-pattern", "snare", this.drumPatterns['snare']);
        this.socket.emit("update-drum-pattern", "hihat", this.drumPatterns['hihat']);
        this.socket.emit("update-drum-pattern", "kick", this.drumPatterns['kick']);
    }

    prevInstrumentSound(instrumentName:string) {
        this.soundSettings[instrumentName]--;
        if (this.soundSettings[instrumentName] <= 0) {
            this.soundSettings[instrumentName] = this.MusicService.getNumberOfSoundsAvailable(instrumentName);
        }
    }

    nextInstrumentSound(instrumentName:string) {
        this.soundSettings[instrumentName]++;
        if (this.soundSettings[instrumentName] > this.MusicService.getNumberOfSoundsAvailable(instrumentName)) {
            this.soundSettings[instrumentName] = 1;
        }
    }
}

angular
    .module("core")
    .service("BeatBuilderService", BeatBuilderService);
