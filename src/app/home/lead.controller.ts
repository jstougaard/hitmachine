/// <reference path="../../types/types.ts"/>


class LeadController extends PlayController {

    public noteKeyMap = {
        49: 1,
        50: 2,
        51: 3,
        52: 4,
        53: 5,
        54: 6,
        55: 7,
        56: 8,
        57: 9
    };


}

angular
    .module("hitmachine.home")
    .controller("LeadController", LeadController);
