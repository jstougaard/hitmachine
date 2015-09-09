/// <reference path="angular.d.ts" />

declare module ng.socketIO {

    interface IWebSocket {

        on(eventName: string, callback: Function): void;
        emit(message: string, ...data:any[]): void;
        forward(eventName: string, scope?: ng.IScope): void;
        forward(eventNames: Array<string>, scope?: ng.IScope): void;

        removeListener(eventName: string, callback: Function): void;
        removeAllListeners(eventName: string): void;
    }


}