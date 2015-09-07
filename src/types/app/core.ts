/// <reference path="../libs/angular.d.ts"/>
/// <reference path="../libs/underscore.d.ts"/>

declare module core {

    interface IRootScope extends ng.IScope {
        pageTitle: string;
    }

    // Only add interfaces for the things shared or used in other modules
    interface IGreeting {
        greeting: string;
    }

    interface IHomeService {
        getGreeting(greeting: string): IGreeting;
    }

    interface RhythmBlock {
        start: number;
        length: number;
    }

    interface IMusicService {
        basePattern: Array<RhythmBlock>;
        chordPatterns: Array<Array<RhythmBlock>>;
        isPlaying: boolean;
        activeBeat: number;

        play(): void;
        stop(): void;
    }
}
