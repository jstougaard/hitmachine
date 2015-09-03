/// <reference path="../../types/types.ts"/>


/* @ngInject */
function homeConfig($stateProvider: ng.ui.IStateProvider) {
  $stateProvider.state("home", {
    url: "/home",
    controller: "HomeController as vm",
    templateUrl: "home/index.html"
  });
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
}

angular
  .module("hitmachine.home", [
    "home.index",
    "home.directives",
    "core.directives",
    "ui.router.state"
  ])
  .config(homeConfig);
