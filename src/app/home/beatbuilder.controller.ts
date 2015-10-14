/// <reference path="../../types/types.ts"/>


class BeatBuilderController {

    /* @ngInject */
    constructor(
        private $rootScope: core.IRootScope,
        private $scope: ng.IScope,
        private $timeout: ng.ITimeoutService,
        private socket: ng.socketIO.IWebSocket,
        public MusicService: core.IMusicService,
        public BeatBuilderService: core.IBeatBuilderService
    ) {
        $rootScope.pageTitle = "BUILD AND APPLY";
        $timeout(() => {
            if (!this.BeatBuilderService) {
                this.BeatBuilderService.currentProgressionName = "1-5-6-4";
            }
        }, 500);

    }

}

angular
  .module("hitmachine.home")
  .controller("BeatBuilderController", BeatBuilderController);
