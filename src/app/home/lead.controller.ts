/// <reference path="../../types/types.ts"/>


class LeadController {

    noteKeyMap = {
        49: 1,
        50: 2,
        51: 3,
        52: 4,
        53: 5,
        54: 6,
        55: 7,
        56: 8
    };

    notesOn = [];

    /* @ngInject */
    constructor(
        private $rootScope: core.IRootScope,
        private $scope: ng.IScope,
        private $document: ng.IDocumentService,
        private socket: ng.socketIO.IWebSocket,
        public MusicService: core.IMusicService
    ) {
        $rootScope.pageTitle = "LEAD";

        this.registerKeyboardEvents();
    }

    registerKeyboardEvents() {
        var onKeyDown = (event) => {
                var note = this.noteKeyMap[event.which];
                if (note && this.notesOn.indexOf(note) === -1) {
                    this.noteOn(note);
                    this.$scope.$apply();
                }
            },
            onKeyUp = (event) => {
                var note = this.noteKeyMap[event.which];
                if (this.notesOn.indexOf(note) > -1) {
                    this.noteOff(note);
                    this.$scope.$apply();
                }
            };

        this.$document.on("keydown", onKeyDown);
        this.$document.on("keyup", onKeyUp);

        // Remove event listeners on destroy
        this.$scope.$on('$destroy', () => {
            this.$document.off("keydown", onKeyDown);
            this.$document.off("keyup", onKeyUp);
        });
    }

    noteOn(note) {
        // Start note
        //console.log("Key down", note);
        this.socket.emit("start-note", note);
        this.notesOn.push(parseInt(note,10));
    }

    noteOff(note) {
        // Stop note
        //console.log("Key up", note);
        this.socket.emit("stop-note", note);
        this.notesOn.splice(this.notesOn.indexOf(parseInt(note,10)), 1);
    }
}

angular
    .module("hitmachine.home")
    .controller("LeadController", LeadController);
