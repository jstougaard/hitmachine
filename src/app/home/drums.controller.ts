/// <reference path="../../types/types.ts"/>


class DrumsController {

    public snarePattern: any = [];
    public hihatPattern: any = [];

  /* @ngInject */
  constructor(
    private $rootScope: core.IRootScope,
    private $scope: ng.IScope,
    private socket: ng.socketIO.IWebSocket,
    public MusicService: core.IMusicService
  ) {

    $rootScope.pageTitle = "DRUMS";

  }

    patternChanged() {
        console.log("Drums changed");
        //this.socket.emit("update-base-pattern", this.MusicService.basePattern);
    }

}

angular
  .module("hitmachine.home")
  .controller("DrumsController", DrumsController);
