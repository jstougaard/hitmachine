/// <reference path="../../types/types.ts"/>


class DrumsController extends PlayController {

    noteKeyMap = {
        49: "kick",
        50: "snare",
        51: "hihat"
    };

    volumeChanged(volume) {
        console.log("Volume changed", volume);
        this.MusicService.volumeChanged('snare', volume);
        this.MusicService.volumeChanged('hihat', volume);
        this.MusicService.volumeChanged('kick', volume);
    }

    patternChanged(drumName: string) {
        //console.log("Drums changed", drumName, this.MusicService.drumPatterns[drumName]);
        this.socket.emit("update-drum-pattern", drumName, this.MusicService.drumPatterns[drumName]);
    }

    resetPattern(drumName: string) {
        this.MusicService.drumPatterns[drumName] = [];
        this.patternChanged(drumName);
    }

}

angular
  .module("hitmachine.home")
  .controller("DrumsController", DrumsController);
