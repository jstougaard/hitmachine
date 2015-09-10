/// <reference path="../../types/types.ts"/>


class DrumsController {

  /* @ngInject */
  constructor(
    private $rootScope: core.IRootScope,
    private $scope: ng.IScope,
    private socket: ng.socketIO.IWebSocket,
    public MusicService: core.IMusicService
  ) {

    $rootScope.pageTitle = "DRUMS";

  }

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

}

angular
  .module("hitmachine.home")
  .controller("DrumsController", DrumsController);
