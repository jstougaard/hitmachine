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
        templateUrl: "home/bass.html",
        resolve: {
            name: function() {
                return "bass";
            }
        }
    });
    $stateProvider.state("chords", {
        url: "/chords",
        controller: "ChordsController as vm",
        templateUrl: "home/chords.html",
        resolve: {
            name: function() {
                return "chords";
            }
        }
    });
    $stateProvider.state("drums", {
        url: "/drums",
        controller: "DrumsController as vm",
        templateUrl: "home/drums.html",
        resolve: {
            name: function() {
                return "drums";
            }
        }
    });
    $stateProvider.state("lead", {
        url: "/lead1",
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
    $stateProvider.state("lead3", {
        url: "/lead3",
        controller: "LeadController as vm",
        templateUrl: "home/lead.html",
        resolve: {
            name: function() {
                return "lead3";
            }
        }
    });
    $stateProvider.state("lead4", {
        url: "/lead4",
        controller: "LeadController as vm",
        templateUrl: "home/lead.html",
        resolve: {
            name: function() {
                return "lead4";
            }
        }
    });
    $stateProvider.state("lead5", {
        url: "/lead5",
        controller: "LeadController as vm",
        templateUrl: "home/lead.html",
        resolve: {
            name: function() {
                return "lead5";
            }
        }
    });
    $stateProvider.state("lead6", {
        url: "/lead6",
        controller: "LeadController as vm",
        templateUrl: "home/lead.html",
        resolve: {
            name: function() {
                return "lead6";
            }
        }
    });
    $stateProvider.state("lead7", {
        url: "/lead7",
        controller: "LeadController as vm",
        templateUrl: "home/lead.html",
        resolve: {
            name: function() {
                return "lead7";
            }
        }
    });
    $stateProvider.state("lead8", {
        url: "/lead8",
        controller: "LeadController as vm",
        templateUrl: "home/lead.html",
        resolve: {
            name: function() {
                return "lead8";
            }
        }
    });
    $stateProvider.state("lead9", {
        url: "/lead9",
        controller: "LeadController as vm",
        templateUrl: "home/lead.html",
        resolve: {
            name: function() {
                return "lead9";
            }
        }
    });
    $stateProvider.state("lead10", {
        url: "/lead10",
        controller: "LeadController as vm",
        templateUrl: "home/lead.html",
        resolve: {
            name: function() {
                return "lead10";
            }
        }
    });
}

angular
  .module("hitmachine.home", [
    "core.directives",
    "dndLists",
    "ui.router.state",
    'angularScreenfull'
  ])
  .config(homeConfig);
