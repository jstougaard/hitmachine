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
        currentProgressionIndex: number;
        songProgression: Array<string>;
        basePattern: Array<RhythmBlock>;
        bassPattern: Array<RhythmBlock>;
        chordPatterns: Array<Array<RhythmBlock>>;
        drumPatterns: {[drumName:string]:Array<RhythmBlock>;};
        isPlaying: boolean;
        activeBeat: number;

        chordProgressionNames: Array<string>;
        currentProgressionName: string;

        play(): void;
        stop(): void;
        volumeChanged(instrumentName: string, newVolume?: number): void;
    }

    interface IMusicComponentConfig {
        volume: number;
    }
}
