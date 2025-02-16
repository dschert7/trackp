const midiConfig = {
    pages: [
        {
            pageNum: 1,
            pagelabel: "Controls",
            parameters: [
                { name: "Param2", CC_in: 81, isNRPN: false, CC_out: 20, range: [0, 127] },    //encoder 2
                { name: "Param4", CC_in: 83, isNRPN: false, CC_out: 22, range: [0, 127] },    //encoder 4
                { name: "Param6", CC_in: 85, isNRPN: false, CC_out: 24, range: [0, 127] },    //encoder 6
                { name: "Param8", CC_in: 87, isNRPN: false, CC_out: 26, range: [0, 127] },    //encoder 8
                { name: "Param1", CC_in: 80, isNRPN: false, CC_out: 19, range: [0, 127] },    //encoder 1
                { name: "Param3", CC_in: 82, isNRPN: false, CC_out: 21, range: [0, 127] },    //encoder 3
                { name: "Param5", CC_in: 84, isNRPN: false, CC_out: 23, range: [0, 127] },    //encoder 5
                { name: "Param7", CC_in: 86, isNRPN: false, CC_out: 25, range: [0, 127] }    //encoder 7
                // Add other parameters as needed
            ]
        },
        {
            pageNum: 2,
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
