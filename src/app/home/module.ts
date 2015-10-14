/// <reference path="../../types/types.ts"/>


/* @ngInject */
function homeConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("beatbuilder", {
        url: "/beatbuilder",
        controller: "BeatBuilderController as vm",
        templateUrl: "home/beatbuilder.html"
    });
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
    $stateProvider.state("lead_overview", {
        url: "/lead_overview",
        controller: "OverviewController as vm",
        templateUrl: "home/overview.html"
    });

    // Init leads
    var numberOfLeads = 8;
    for (var i=1;i<=numberOfLeads;i++) {
        (function(leadId) {
            $stateProvider.state(leadId, {
                url: "/" + leadId,
                controller: "LeadController as vm",
                templateUrl: "home/lead.html",
                resolve: {
                    name: function() {
                        return leadId;
                    }
                }
            });
        })("lead" + i);
    }
}

angular
  .module("hitmachine.home", [
    "core.directives",
    "dndLists",
    "ui.router.state",
    'angularScreenfull'
  ])
  .config(homeConfig);
