/// <reference path="../types/types.ts"/>


/* @ngInject */
function appConfig($urlRouterProvider: ng.ui.IUrlRouterProvider) {
  $urlRouterProvider.otherwise("/home");
}

angular
  .module("hitmachine", [
    "templates",
    "hitmachine.home",
    "ui.router.state"
  ])
  .config(appConfig);
