/// <reference path="../../types/types.ts"/>


class OverviewController {

    public colors = {
        lead1: "#b5022c",
        lead2: "#f9fc00",
        lead3: "#066031",
        lead4: "#92c272",
        lead5: "#007ee5",
        lead6: "#fbb4e3",
        lead7: "#C55A26",
        lead8: "#7d6a96"
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
