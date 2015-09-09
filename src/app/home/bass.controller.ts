/// <reference path="../../types/types.ts"/>


class BassController {

  /* @ngInject */
  constructor(
    private $rootScope: core.IRootScope,
    private socket: ng.socketIO.IWebSocket,
    public MusicService: core.IMusicService
  ) {
    $rootScope.pageTitle = "BASS";

  }

    patternChanged() {
        console.log("Controller says: Pattern changed", this.MusicService.bassPattern);
        this.socket.emit("update-bass-pattern", this.MusicService.bassPattern);
    }

}

angular
  .module("hitmachine.home")
  .controller("BassController", BassController);
