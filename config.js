const midiConfig = {
    pages: [
        {
            pageNum: 1,
            pagelabel: "OSC 1",
            parameters: [
                { name: "wave interpolate", CC_in: 81, isNRPN: false, CC_out: 20, range: [0, 127] },    //encoder 2
                { name: "virtual sync depth", CC_in: 83, isNRPN: false, CC_out: 22, range: [0, 127] },    //encoder 4
                { name: "density detune", CC_in: 85, isNRPN: false, CC_out: 25, range: [0, 127] },    //encoder 6
                { name: "cents", CC_in: 87, isNRPN: false, CC_out: 27, range: [0, 127] },    //encoder 8
                { name: "wave", CC_in: 80, isNRPN: false, CC_out: 19, range: [0, 29] },    //encoder 1
                { name: "pulse width index", CC_in: 82, isNRPN: false, CC_out: 21, range: [0, 127] },    //encoder 3
                { name: "density", CC_in: 84, isNRPN: false, CC_out: 24, range: [0, 127] },    //encoder 5
                { name: "semitones", CC_in: 86, isNRPN: false, CC_out: 26, range: [0, 127] }    //encoder 7
                // Add other parameters as needed
            ]
        },
        {
            pageNum: 2,
            pagelabel: "OSC 2",
            parameters: [
                { name: "wave interpolate", CC_in: 81, isNRPN: false, CC_out: 30, range: [0, 127] },    //encoder 2
                { name: "virtual sync depth", CC_in: 83, isNRPN: false, CC_out: 33, range: [0, 127] },    //encoder 4
                { name: "density detune", CC_in: 85, isNRPN: false, CC_out: 36, range: [0, 127] },    //encoder 6
                { name: "cents", CC_in: 87, isNRPN: false, CC_out: 39, range: [0, 127] },    //encoder 8
                { name: "wave", CC_in: 80, isNRPN: false, CC_out: 29, range: [0, 29] },    //encoder 1
                { name: "pulse width index", CC_in: 82, isNRPN: false, CC_out: 31, range: [0, 127] },    //encoder 3
                { name: "density", CC_in: 84, isNRPN: false, CC_out: 35, range: [0, 127] },    //encoder 5
                { name: "semitones", CC_in: 86, isNRPN: false, CC_out: 37, range: [0, 127] }    //encoder 7
                // Add other parameters as needed
            ]
        },
        {
            pageNum: 3,
            pagelabel: "Mixer",
            parameters: [
                { name: "osc 2 lvl", CC_in: 81, isNRPN: false, CC_out: 52, range: [0, 127] },    //encoder 2
                { name: "noise lvl", CC_in: 83, isNRPN: false, CC_out: 56, range: [0, 127] },    //encoder 4
                { name: "post FX level", CC_in: 85, isNRPN: false, CC_out: 59, range: [52, 82] },    //encoder 6
                { name: "none", CC_in: 87, isNRPN: false, CC_out: 00, range: [0, 127] },    //encoder 8
                { name: "osc 1 lvl", CC_in: 80, isNRPN: false, CC_out: 51, range: [0, 127] },    //encoder 1
                { name: "ring mod lvl", CC_in: 82, isNRPN: false, CC_out: 54, range: [0, 127] },    //encoder 3
                { name: "pre FX level", CC_in: 84, isNRPN: false, CC_out: 58, range: [52, 82] },    //encoder 5
                { name: "none", CC_in: 86, isNRPN: false, CC_out: 00, range: [0, 127] }    //encoder 7
                // Add other parameters as needed
            ]
        },
        {
            pageNum: 4,
            pagelabel: "Filter",
            parameters: [
                { name: "drive", CC_in: 81, isNRPN: false, CC_out: 63, range: [0, 127] },    //encoder 2
                { name: "type", CC_in: 83, isNRPN: false, CC_out: 68, range: [0, 5] },    //encoder 4
                { name: "tracking", CC_in: 85, isNRPN: false, CC_out: 69, range: [0, 127] },    //encoder 6
                { name: "Q normalize", CC_in: 87, isNRPN: false, CC_out: 78, range: [0, 127] },    //encoder 8
                { name: "routing", CC_in: 80, isNRPN: false, CC_out: 60, range: [0, 2] },    //encoder 1
                { name: "drive type", CC_in: 82, isNRPN: false, CC_out: 65, range: [0, 6] },    //encoder 3
                { name: "frequency", CC_in: 84, isNRPN: false, CC_out: 74, range: [52, 82] },    //encoder 5
                { name: "resonance", CC_in: 86, isNRPN: false, CC_out: 71, range: [0, 127] }    //encoder 7
                // Add other parameters as needed
            ]
        },
        {
            pageNum: 5,
            pagelabel: "Env 1",
            parameters: [
                { name: "env 1 attack", CC_in: 81, isNRPN: false, CC_out: 73, range: [0, 127] },    //encoder 2
                { name: "env 1 sustain	", CC_in: 83, isNRPN: false, CC_out: 70, range: [0, 127] },    //encoder 4
                { name: "none", CC_in: 85, isNRPN: false, CC_out: 00, range: [0, 127] },    //encoder 6
                { name: "none", CC_in: 87, isNRPN: false, CC_out: 00, range: [0, 127] },    //encoder 8
                { name: "env1 velocity", CC_in: 80, isNRPN: false, CC_out: 108, range: [0, 127] },    //encoder 1
                { name: "env 1 decay", CC_in: 82, isNRPN: false, CC_out: 75, range: [0, 127] },    //encoder 3
                { name: "env 1 release", CC_in: 84, isNRPN: false, CC_out: 72, range: [0, 127] },    //encoder 5
                { name: "none", CC_in: 86, isNRPN: false, CC_out: 00, range: [0, 127] }    //encoder 7
                // Add other parameters as needed
            ]
        },
        {
            pageNum: 6,
            pagelabel: "Env 2",
            parameters: [
                { name: "env 2 attack", CC_in: 81, isNRPN: true, NRPN_val: "0:1", range: [0, 127] },    //encoder 2
                { name: "env 2 sustain	", CC_in: 83, isNRPN: true, NRPN_val: "0:3", range: [0, 127] },    //encoder 4
                { name: "none", CC_in: 85, isNRPN: false, CC_out: 00, range: [0, 127] },    //encoder 6
                { name: "none", CC_in: 87, isNRPN: false, CC_out: 00, range: [0, 127] },    //encoder 8
                { name: "env 2 velocity", CC_in: 80, isNRPN: true, NRPN_val: "0:0", range: [0, 127] },    //encoder 1
                { name: "env 2 decay", CC_in: 82, isNRPN: true, NRPN_val: "0:2", range: [0, 127] },    //encoder 3
                { name: "env 2 release", CC_in: 84, isNRPN: true, NRPN_val: "0:4", range: [0, 127] },    //encoder 5
                { name: "none", CC_in: 86, isNRPN: false, CC_out: 00, range: [0, 127] }    //encoder 7
                // Add other parameters as needed
            ]
        }
        // Add other pages as needed
    ]
};
