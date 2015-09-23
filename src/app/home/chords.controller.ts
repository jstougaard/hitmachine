/// <reference path="../../types/types.ts"/>


class ChordsController extends PlayController {

    public noteKeyMap = {
        49: 1,
        50: 2,
        51: 3,
        52: 4,
        53: 5
    };

    progressionChanged() {
        console.log("Chord progression changed", this.MusicService.currentProgressionName);
        this.socket.emit("set-chord-progression", this.MusicService.currentProgressionName);
    }

    patternChanged() {
        var pattern = this.MusicService.chordPatterns; //[this.patternTone1, this.patternTone2, this.patternTone3];
        console.log("Chord pattern changed", pattern);
        this.socket.emit("update-chord-pattern", pattern);
    }

}

angular
  .module("hitmachine.home")
  .controller("ChordsController", ChordsController);
