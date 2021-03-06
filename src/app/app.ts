/// <reference path="../types/types.ts"/>


/* @ngInject */
function appConfig($urlRouterProvider: ng.ui.IUrlRouterProvider) {
  $urlRouterProvider.otherwise("/rhythm");
}

angular
  .module("hitmachine", [
    "templates",
    "core",
    "hitmachine.home",
    "ui.router.state",
    'ui.slider',
    'ui.bootstrap',
    "btford.socket-io"
  ])
  .config(appConfig);
