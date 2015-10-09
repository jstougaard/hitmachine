/// <reference path="../../types/types.ts"/>

class PlayController {

    public noteKeyMap = {};

    public pitchShift: number = 0;

    public notesOn = [];

    /* @ngInject */
    constructor(private $rootScope:core.IRootScope,
                protected $scope:ng.IScope,
                protected $document:ng.IDocumentService,
                protected socket:ng.socketIO.IWebSocket,
                public name:string,
                public MusicService:core.IMusicService) {

        $rootScope.pageTitle = name.toUpperCase();
        console.log("Play controller", name, this.noteKeyMap);

        //if (!_.isEmpty(this.noteKeyMap)) {
            this.registerKeyboardEvents();
        //}
    }

    registerKeyboardEvents() {
        var onKeyDown = this.onKeyDown.bind(this),
            onKeyUp = this.onKeyUp.bind(this);

        this.$document.on("keydown", onKeyDown);
        this.$document.on("keyup", onKeyUp);

        // Remove event listeners on destroy
        this.$scope.$on('$destroy', () => {
            this.$document.off("keydown", onKeyDown);
            this.$document.off("keyup", onKeyUp);
        });
    }

    onKeyDown(event) {
        var note = this.noteKeyMap[event.which];
        if (note && this.notesOn.indexOf(note) === -1) {
            this.noteOn(note);
            this.$scope.$apply();
        }
    }

    onKeyUp(event) {
        var note = this.noteKeyMap[event.which];
        if (this.notesOn.indexOf(note) > -1) {
            this.noteOff(note);
            this.$scope.$apply();
        }
    }

    noteOn(note) {
        // Start note
        //console.log("Key down", note);
        this.socket.emit(this.name + "/start-note", this.getPitchShiftedNote(note) );
        this.notesOn.push(note);
    }

    noteOff(note) {
        // Stop note
        //console.log("Key up", note);
        this.socket.emit(this.name + "/stop-note", this.getPitchShiftedNote(note) );
        this.notesOn.splice(this.notesOn.indexOf(note), 1);
    }

    getPitchShiftedNote(note) {
        return parseInt(note, 10) + this.pitchShift;
    }

    isTouchDevice() {
        return !!('ontouchstart' in window);
    }
}


angular
    .module("core")
    .controller("PlayController", PlayController);
