/// <reference path="../../types/types.ts"/>


class RhythmController {

    public nextProgression: number = null;

  /* @ngInject */
  constructor(
    private $rootScope: core.IRootScope,
    private $scope: ng.IScope,
    private socket: ng.socketIO.IWebSocket,
    public MusicService: core.IMusicService
  ) {
    $rootScope.pageTitle = "RHYTHM";
    //console.log("Service", this.MusicService.basePattern, this.MusicService.basePattern.length);
    var _this = this;
    this.socket.on("set-progression-index", function() {
      _this.nextProgression = null;
    });

  }

    patternChanged() {
        console.log("Controller says: Pattern changed", this.MusicService.basePattern);
        this.socket.emit("update-base-pattern", this.MusicService.basePattern);
    }

    gotoProgression(index) {
        //console.log("Goto progression", index);
        this.nextProgression = index;
        this.socket.emit("goto-song-progression", index);
    }

}

angular
  .module("hitmachine.home")
  .controller("RhythmController", RhythmController);
