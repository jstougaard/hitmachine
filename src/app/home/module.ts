/// <reference path="../../types/types.ts"/>


/* @ngInject */
function homeConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("rhythm", {
        url: "/rhythm",
        controller: "RhythmController as vm",
        templateUrl: "home/rhythm.html"
    });
    $stateProvider.state("chords", {
        url: "/chords",
        controller: "ChordsController as vm",
        templateUrl: "home/chords.html"
    });
    $stateProvider.state("drums", {
        url: "/drums",
        controller: "DrumsController as vm",
        templateUrl: "home/drums.html"
    });
    $stateProvider.state("lead", {
        url: "/lead",
        controller: "LeadController as vm",
        templateUrl: "home/lead.html"
    });
}

angular
  .module("hitmachine.home", [
    "core.directives",
    "ui.router.state"
  ])
  .config(homeConfig);
