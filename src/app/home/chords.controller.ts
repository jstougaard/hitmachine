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
    $scope.$on('$destroy', this.deRegisterEvents.bind(this));
  }

    patternChanged() {
        var pattern = [this.patternTone1, this.patternTone2, this.patternTone3];
        console.log("Chord pattern changed", pattern);
        this.socket.emit("update-chord-pattern", pattern);
    }

    registerEvents() {
        this.socket.on("init-base-pattern", this.onNewBasePattern.bind(this));
        this.socket.on("update-base-pattern", this.onNewBasePattern.bind(this));
    }

    deRegisterEvents() {
        console.log("Deregister chord events");
        this.socket.removeListener("init-base-pattern", this.onNewBasePattern);
        this.socket.removeListener("update-base-pattern", this.onNewBasePattern);
    }

    onNewBasePattern(pattern) {
        console.log("Chords say new base pattern!");
        this.basePattern = pattern;
    }
}

angular
  .module("hitmachine.home")
  .controller("ChordsController", ChordsController);
