/// <reference path="../../types/types.ts"/>


class HeaderController {

    /* @ngInject */
    constructor(
        private socket: ng.socketIO.IWebSocket,
        public MusicService: core.IMusicService
    ) {

    }

    togglePlay() {
        if (!this.MusicService.isPlaying) {
            this.MusicService.play();
        } else {
            this.MusicService.stop();
        }
    }

}

angular
    .module("core")
    .controller("HeaderController", HeaderController);
