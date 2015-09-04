/// <reference path="../../types/types.ts"/>


class RhythmController {
    basePattern: Array<core.RhythmBlock> = [];
    activeBeat: number = null;
    isPlaying: boolean = false;


  /* @ngInject */
  constructor(
    private $rootScope: core.IRootScope,
    private socket: ng.socketIO.IWebSocket
  ) {
    $rootScope.pageTitle = "RHYTHM";

    this.registerEvents();
  }

    registerEvents() {
        this.socket.on("beat", (activeBeat) => {
            this.activeBeat = activeBeat;
        });

        this.socket.on("init-base-pattern", (pattern) => {
            if (pattern && pattern.length > 0) {
                console.log("Base pattern init", pattern, this);
                this.basePattern = pattern;
            }
        });
    }

    patternChanged() {
        console.log("Controller says: Pattern changed", this.basePattern);
        this.socket.emit("update-base-pattern", this.basePattern);

    }

    toggleBeat() {
        if (this.isPlaying) {
            this.socket.emit("stop-beat", true);
            this.isPlaying = false;
        } else {
            this.socket.emit("start-beat", true);
            this.isPlaying = true;
        }
    }
}

angular
  .module("hitmachine.home")
  .controller("RhythmController", RhythmController);
