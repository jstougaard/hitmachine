/// <reference path="../../types/types.ts"/>


class DrumsController {

    public drumPatterns = {
        "snare": [],
        "hihat": [],
        "kick": []
    };

  /* @ngInject */
  constructor(
    private $rootScope: core.IRootScope,
    private $scope: ng.IScope,
    private socket: ng.socketIO.IWebSocket,
    public MusicService: core.IMusicService
  ) {

    $rootScope.pageTitle = "DRUMS";

  }

    patternChanged(drumName: string) {
        //console.log("Drums changed", drumName, this.MusicService.drumPatterns[drumName]);
        this.socket.emit("update-drum-pattern", drumName, this.MusicService.drumPatterns[drumName]);
    }

}

angular
  .module("hitmachine.home")
  .controller("DrumsController", DrumsController);
