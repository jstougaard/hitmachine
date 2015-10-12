/// <reference path="../../types/types.ts"/>


class OverviewController {

  /* @ngInject */
  constructor(
    private $rootScope: core.IRootScope,
    private $scope: ng.IScope,
    private socket: ng.socketIO.IWebSocket,
    public MusicService: core.IMusicService
  ) {
    $rootScope.pageTitle = "LEAD OVERVIEW";

  }


    range(n) {
        return new Array(n);
    }
}

angular
  .module("hitmachine.home")
  .controller("OverviewController", OverviewController);
