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
            pagelabel: "Effects",
            parameters: [
                { name: "Param1", CC_in: 80, isNRPN: true, NRPN_val: "0:1", range: [0, 127] },
                { name: "Param2", CC_in: 81, isNRPN: false, CC_out: 20, range: [0, 127] },
                // Add other parameters as needed
            ]
        }
        // Add other pages as needed
    ]
};
