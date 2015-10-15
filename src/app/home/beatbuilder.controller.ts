/// <reference path="../../types/types.ts"/>


class BeatBuilderController {

    public commonDrumSound = null;

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
        ["hihat", "snare", "kick", "ride", "crash"].forEach((drumName) => {
            this.BeatBuilderService.soundSettings[drumName] = parseInt(this.commonDrumSound, 10) + 1;
        });
    }

    basePatternChanged() {
        this.BeatBuilderService.drumPatterns['ride'] = _.clone(this.BeatBuilderService.basePattern);
        this.$scope.$apply();
    }

    randomizeSounds() {
        for (var instrument in this.BeatBuilderService.soundSettings) {
            if (this.BeatBuilderService.soundSettings.hasOwnProperty(instrument)) {
                this.BeatBuilderService.soundSettings[instrument] = this.randomNumber(1, this.MusicService.getNumberOfSoundsAvailable(instrument));
            }
        }
    }

    randomNumber(min:number, max:number) {
        return Math.floor(Math.random() * max) + min;
    }
}

angular
  .module("hitmachine.home")
  .controller("BeatBuilderController", BeatBuilderController);
