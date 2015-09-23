/// <reference path="../../types/types.ts"/>


class BassController extends PlayController {

    noteKeyMap = {
        49: 1
    };

    patternChanged() {
        console.log("Controller says: Pattern changed", this.MusicService.bassPattern);
        this.socket.emit("update-bass-pattern", this.MusicService.bassPattern);
    }

}

angular
  .module("hitmachine.home")
  .controller("BassController", BassController);
