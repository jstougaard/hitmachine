/// <reference path="../../types/types.ts"/>


class BeatBuilderController {

    public commonDrumSound = null;
    private drumNames = ["hihat", "snare", "kick"];

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
            if (!this.BeatBuilderService.currentProgressionName) {
                this.BeatBuilderService.currentProgressionName = "1-5-6-4";
            }
        }, 500);

    }

    setDrumSounds() {
        this.drumNames.forEach((drumName) => {
            this.BeatBuilderService.soundSettings[drumName] = parseInt(this.commonDrumSound, 10) + 1;
        });
    }

    basePatternChanged() {
        this.BeatBuilderService.drumPatterns['ride'] = _.clone(this.BeatBuilderService.basePattern);
        this.$scope.$apply();
    }

}

angular
  .module("hitmachine.home")
  .controller("BeatBuilderController", BeatBuilderController);
