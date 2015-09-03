/// <reference path="../../types/types.ts"/>


class RhythmController {
    basePattern: Array<core.RhythmBlock> = [];

    ignoreNextUpdate: boolean = false;

  /* @ngInject */
  constructor(
    private $rootScope: core.IRootScope,
    private socket: ng.socketIO.IWebSocket
  ) {
    $rootScope.pageTitle = "RHYTHM";

    this.registerEvents();
  }

    registerEvents() {
        this.socket.on("update-base-pattern", (pattern) => {
            if (!this.ignoreNextUpdate) {
                console.log("Base pattern updated", pattern);
                this.basePattern = pattern;
                this.ignoreNextUpdate = false;
            }
        });
    }

    patternChanged() {
        console.log("Controller says: Pattern changed", this, this.basePattern);
        this.socket.emit("update-base-pattern", this.basePattern);
        this.ignoreNextUpdate = true;
    }
}

angular
  .module("hitmachine.home")
  .controller("RhythmController", RhythmController);
