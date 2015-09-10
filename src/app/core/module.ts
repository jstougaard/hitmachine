/// <reference path="../../types/types.ts"/>


angular
    .module("core", [])
    .factory("socket", ["socketFactory", function(socketFactory: any) {
        return socketFactory();
    }])
    .directive('myTouchstart', [function() {
        return function(scope, element, attr) {

            element.on('touchstart', function(event) {
                scope.$apply(function() {
                    scope.$eval(attr.myTouchstart);
                });
            });
        };
    }]).directive('myTouchend', [function() {
        return function(scope, element, attr) {

            element.on('touchend', function(event) {
                scope.$apply(function() {
                    scope.$eval(attr.myTouchend);
                });
            });
        };
    }]);
