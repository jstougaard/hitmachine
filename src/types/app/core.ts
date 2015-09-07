/// <reference path="../libs/angular.d.ts"/>
/// <reference path="../libs/underscore.d.ts"/>

declare module core {

    interface IRootScope extends ng.IScope {
        pageTitle: string;
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
