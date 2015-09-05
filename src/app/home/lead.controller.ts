/// <reference path="../../types/types.ts"/>


class LeadController {
    basePattern: Array<core.RhythmBlock> = [];

    noteKeyMap = {
        49: 1,
        50: 2,
        51: 3,
        52: 4,
        53: 5
    };

    keysDown = [];

    /* @ngInject */
    constructor(
        private $rootScope: core.IRootScope,
        private $scope: ng.IScope,
        private $document: ng.IDocumentService,
        private socket: ng.socketIO.IWebSocket
    ) {
        $rootScope.pageTitle = "LEAD";

        this.registerSocketEvents();
        this.registerKeyboardEvents();

        $scope.$on('$destroy', this.deRegisterEvents.bind(this));
    }

    registerSocketEvents() {
        this.socket.on("init-base-pattern", this.onNewBasePattern.bind(this));
        this.socket.on("update-base-pattern", this.onNewBasePattern.bind(this));
    }

    registerKeyboardEvents() {
        this.$document.on("keydown", this.onKeyDown.bind(this));
        this.$document.on("keyup", this.onKeyUp.bind(this));
    }

    deRegisterEvents() {
        this.$document.off("keydown", this.onKeyDown);
        this.$document.off("keyup", this.onKeyUp);
    }

    onNewBasePattern(pattern) {
        this.basePattern = pattern;
    }

    onKeyDown(event) {
        var key = event.which;
        if (key in this.noteKeyMap && this.keysDown.indexOf(key) === -1) {
            // Start note
            //console.log("Key down", key);
            this.socket.emit("start-note", this.noteKeyMap[key]);
            this.keysDown.push(key);
            this.$scope.$apply();
        }
    }

    onKeyUp(event) {
        var key = parseInt(event.which, 10);
        var index = this.keysDown.indexOf(key);
        if (index > -1) {
            // Stop note
            //console.log("Key up", key);
            this.socket.emit("stop-note", this.noteKeyMap[key]);
            this.keysDown.splice(index, 1);
            this.$scope.$apply();
        }
    }
}

angular
    .module("hitmachine.home")
    .controller("LeadController", LeadController);
