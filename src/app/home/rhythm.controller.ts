/// <reference path="../../types/types.ts"/>


class RhythmController {

    public nextProgressionId: number = null;


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
    this.socket.on("set-current-progression-id", function() {
      _this.nextProgressionId = null;
    });

  }

    patternChanged() {
        console.log("Controller says: Pattern changed", this.MusicService.basePattern);
        this.socket.emit("update-base-pattern", this.MusicService.basePattern);
    }

    setNextProgression(id) {
        //console.log("Goto progression", index);
        this.nextProgressionId = id;
        this.socket.emit("set-next-progression-id", id);
    }

    getProgressionObjectFromName(name) {
        return {
            name: name,
            id: null
        };
    }

    itemMoved(oldIndex) {
        //console.log("Was moved", oldIndex);
        this.MusicService.songProgression.splice(oldIndex, 1);
        this.progressionChanged();
    }

    itemAdded(event) {
        //console.log("New item", event);
        this.progressionChanged();
    }

    removeItem(index) {
        this.MusicService.songProgression.splice(index, 1);
        this.progressionChanged();
    }

    progressionChanged() {
        //console.log("Changed", this.MusicService.songProgression);
        this.socket.emit("update-song-progression", this.MusicService.songProgression);
    }

}

angular
  .module("hitmachine.home")
  .controller("RhythmController", RhythmController);
