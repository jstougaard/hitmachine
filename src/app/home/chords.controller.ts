/// <reference path="../../types/types.ts"/>


class ChordsController {
    basePattern: Array<core.RhythmBlock> = [];
    patternTone1: Array<core.RhythmBlock> = [];
    patternTone2: Array<core.RhythmBlock> = [];
    patternTone3: Array<core.RhythmBlock> = [];

  /* @ngInject */
  constructor(
    private $rootScope: core.IRootScope,
    private $scope: ng.IScope,
    private socket: ng.socketIO.IWebSocket
  ) {
    $rootScope.pageTitle = "CHORDS";

    this.registerEvents();
  }

    patternChanged() {
        console.log("Controller says: Pattern changed", this, this.basePattern);
        this.socket.emit("update-base-pattern", this.basePattern);
    }

    registerEvents() {
        this.socket.on("init-base-pattern", (pattern) => {
            console.log("Init base pattern", pattern, pattern.length);
            this.basePattern = pattern;
        });
        this.socket.on("update-base-pattern", (pattern) => {
           console.log("Base pattern updated", pattern);
            this.basePattern = pattern;
        });
    }
}

angular
  .module("hitmachine.home")
  .controller("ChordsController", ChordsController);
