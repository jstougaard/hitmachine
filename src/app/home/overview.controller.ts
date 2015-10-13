/// <reference path="../../types/types.ts"/>


class OverviewController {

    public colors = {
        lead1: "#C55A26",
        lead2: "#066031",
        lead3: "#007ee5",
        lead4: "#7d6a96",
        lead5: "#f9fc00",
        lead6: "#fbb4e3",
        lead7: "#92c272",
        lead8: "#b5022c"
    };

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
