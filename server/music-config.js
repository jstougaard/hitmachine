module.exports = {
    noteResolution: 16,
    notesPerBar: 4,
    leadNotePattern: [ 1, 3, 5, 8, 10 ],
    leadBaseNote: 72,
    leadDelayMarginPercent: 10,
    maxLeadTones: 9,
    bpm: 120,
    instrumentConfig: {
        lead: {
            volume: 100,
            muted: false
        },
        lead2: {
            volume: 100,
            muted: false
        },
        bass: {
            volume: 100,
            muted: false
        },
        chords: {
            volume: 100,
            muted: false
        },
        kick: {
            volume: 100,
            muted: false
        },
        snare: {
            volume: 100,
            muted: false
        },
        hihat: {
            volume: 100,
            muted: false
        },
        pads: {
            volume: 100,
            muted: false
        }
    },
    chordProgressions: {
        "1-5-6-4": [ [72, 76, 79, 60, 48], [67, 71, 74, 55, 43], [69, 72, 76, 57, 45], [65,69,72, 53, 41] ],
        "1-5-6-3": [ [72, 76, 79, 60, 48], [67, 71, 74, 55, 43], [69, 72, 76, 57, 45], [64, 67, 71, 52, 40] ],
        "6-5-4-5": [ [69, 72, 76, 57, 45], [67, 71, 74, 55, 43], [65,69,72, 53, 41], [67, 71, 74, 55, 43] ],
        "1-6-4-5": [ [72, 76, 79, 60, 48], [69, 72, 76, 57, 45], [65,69,72, 53, 41], [67, 71, 74, 55, 43] ],
        "1-4-6-5": [ [72, 76, 79, 60, 48], [65,69,72, 53, 41], [69, 72, 76, 57, 45], [67, 71, 74, 55, 43] ],
        "1-5-4-6": [ [72, 76, 79, 60, 48], [67, 71, 74, 55, 43], [65,69,72, 53, 41], [69, 72, 76, 57, 45] ],
        "1-5(6)-6-6": [ [72, 76, 79, 60, 48], [67, 71, 76, 55, 43], [69, 72, 76, 57, 45], [69, 72, 76, 57, 45] ],
        "4-1(6)-5-5": [ [65,69,72, 53, 41], [72, 76, 81, 60, 48], [67, 71, 74, 55, 43], [67, 71, 74, 55, 43] ],
        "4-1(6)-2-2": [ [65,69,72, 53, 41], [72, 76, 81, 60, 48], [74, 77, 81, 62, 50], [74, 77, 81, 62, 50] ],
        "DeepHouse": [ [69, 71, 76, 57, 45], [67, 71, 74, 55, 43], [70, 74, 77, 58, 46], [72 , 76 ,79, 60, 48] ]
    },
    progressionElements: {
        "verse": [ "kick", "snare", "bass", "lead", "lead2", "pads" /*, "chords"*/],
        "verse-bridge": [ "kick", "snare", "hihat", "bass", "pads", "lead", "lead2"],
        "chorus-buildup": [ "chords", "lead", "lead2" ],
        "chorus": [ "kick", "snare", "hihat", "bass", "chords", "pads", "lead", "lead2" ] //TODO: crash
    },
    songProgression: [ "verse", "verse", "verse-bridge", "verse-bridge", "chorus-buildup", "chorus-buildup", "chorus", "chorus" ]

};





