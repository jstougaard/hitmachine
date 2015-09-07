/// <reference path="../../types/types.ts"/>


class RhythmController {

  /* @ngInject */
  constructor(
    private $rootScope: core.IRootScope,
    private $scope: ng.IScope,
    private socket: ng.socketIO.IWebSocket,
    public MusicService: core.IMusicService
  ) {
    $rootScope.pageTitle = "RHYTHM";
    //console.log("Service", this.MusicService.basePattern, this.MusicService.basePattern.length);
  }

    patternChanged() {
        console.log("Controller says: Pattern changed", this.MusicService.basePattern);
        this.socket.emit("update-base-pattern", this.MusicService.basePattern);
    }

}

angular
  .module("hitmachine.home")
  .controller("RhythmController", RhythmController);
