/// <reference path="../../types/types.ts"/>


class DrumsController extends PlayController {

    public commonDrumSound = null;
    private drumNames = ["hihat", "snare", "kick", "ride", "crash"];

    noteKeyMap = {
        49: "kick",
        50: "snare",
        51: "hihat"
    };

    patternChanged(drumName: string) {
        //console.log("Drums changed", drumName, this.MusicService.drumPatterns[drumName]);
        this.socket.emit("update-drum-pattern", drumName, this.MusicService.drumPatterns[drumName]);
    }

    resetPattern(drumName: string) {
        this.MusicService.drumPatterns[drumName] = [];
        this.patternChanged(drumName);
    }

    setDrumSounds() {

        this.drumNames.forEach((drumName) => {
            this.MusicService.setInstrumentSound(drumName, parseInt(this.commonDrumSound, 10) + 1);
        });
    }

}

angular
  .module("hitmachine.home")
  .controller("DrumsController", DrumsController);
