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
        /*this.socket.forward('update-base-pattern', this.$scope);
        this.$scope.$on('socket:update-base-pattern', (ev, data) => {
            console.log("FORWARDED: Base pattern updated", data);
            this.basePattern = data;
        });*/
        this.socket.on("update-base-pattern", (pattern) => {
           console.log("Base pattern updated", pattern);
            this.basePattern = pattern;
        });
    }
}

angular
  .module("hitmachine.home")
  .controller("ChordsController", ChordsController);
