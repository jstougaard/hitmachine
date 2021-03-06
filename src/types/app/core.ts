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
        currentProgressionId: number;
        songProgressionElements: Array<string>;
        songProgression: Array<string>;
        basePattern: Array<RhythmBlock>;
        bassPattern: Array<RhythmBlock>;
        chordPatterns: Array<Array<RhythmBlock>>;
        drumPatterns: {[drumName:string]:Array<RhythmBlock>;};
        isPlaying: boolean;
        activeBeat: number;

        chordProgressionNames: Array<string>;
        currentProgressionName: string;

        soundNames: any;

        play(): void;
        stop(): void;
        volumeChanged(instrumentName: string, newVolume?: number): void;
        getNumberOfSoundsAvailable(instrumentName): number;
        setInstrumentSound(instrumentName:string, soundId:number):void;
    }

    interface IMusicComponentConfig {
        volume?: number;
        sound?: number;
    }

    interface IBeatBuilderService {

        basePattern: Array<RhythmBlock>;
        bassPattern: Array<RhythmBlock>;
        chordPatterns: Array<Array<RhythmBlock>>;
        drumPatterns: {[drumName:string]:Array<RhythmBlock>;};

        currentProgressionName: string;

        soundSettings: any; //{[instrumentName:string]:number;};

        apply(): void;
    }
}
