/// <reference path="../../types/types.ts"/>


class ChordsController {
    patternTone1: Array<core.RhythmBlock> = [];
    patternTone2: Array<core.RhythmBlock> = [];
    patternTone3: Array<core.RhythmBlock> = [];

  /* @ngInject */
  constructor(
    private $rootScope: core.IRootScope,
    private $scope: ng.IScope,
    private socket: ng.socketIO.IWebSocket,
    public MusicService: core.IMusicService
  ) {
    $rootScope.pageTitle = "CHORDS";

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
