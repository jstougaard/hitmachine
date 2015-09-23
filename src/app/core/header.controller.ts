/// <reference path="../../types/types.ts"/>


class HeaderController {

    public showMenu = false;

    /* @ngInject */
    constructor(
        private $rootScope:core.IRootScope,
        private socket: ng.socketIO.IWebSocket,
        private $document: ng.IDocumentService,
        public MusicService: core.IMusicService
    ) {

        this.$document.on("keypress", (event) => {
            // Space key pressed
            if (event.which === 32) {
                this.togglePlay();
            }
        });

        this.$rootScope.$on( "$locationChangeStart", () => {
            this.showMenu = false;
        });

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
