/// <reference path="../../types/types.ts"/>


/* @ngInject */
function homeConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("rhythm", {
        url: "/rhythm",
        controller: "RhythmController as vm",
        templateUrl: "home/rhythm.html"
    });
    $stateProvider.state("bass", {
        url: "/bass",
        controller: "BassController as vm",
        templateUrl: "home/bass.html"
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
        templateUrl: "home/lead.html",
        resolve: {
            name: function() {
                return "lead";
            }
        }
    });
    $stateProvider.state("lead2", {
        url: "/lead2",
        controller: "LeadController as vm",
        templateUrl: "home/lead.html",
        resolve: {
            name: function() {
                return "lead2";
            }
        }
    });
}

angular
  .module("hitmachine.home", [
    "core.directives",
        "dndLists",
    "ui.router.state"
  ])
  .config(homeConfig);
