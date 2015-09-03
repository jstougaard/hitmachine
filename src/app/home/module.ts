/// <reference path="../../types/types.ts"/>


/* @ngInject */
function homeConfig($stateProvider: ng.ui.IStateProvider) {
  $stateProvider.state("home", {
    url: "/home",
    controller: "HomeController as vm",
    templateUrl: "home/index.html"
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
