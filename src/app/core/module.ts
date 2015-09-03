/// <reference path="../../types/types.ts"/>


angular
    .module("core", [])
    .factory("socket", ["socketFactory", function(socketFactory: any) {
        return socketFactory();
    }]);
