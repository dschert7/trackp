const midiConfig = {
    pages: [
        {
            pageNum: 1,
            pagelabel: "Controls",
            parameters: [
                { name: "Param1", CC_in: 80, CC_out: 19, range: [0, 127] },
                { name: "Param2", CC_in: 81, CC_out: 20, range: [0, 127] },
                { name: "Param3", CC_in: 82, CC_out: 21, range: [0, 127] },
                { name: "Param4", CC_in: 83, CC_out: 22, range: [0, 127] },
                { name: "Param5", CC_in: 84, CC_out: 23, range: [0, 127] },
                { name: "Param6", CC_in: 85, CC_out: 24, range: [0, 127] },
                { name: "Param7", CC_in: 86, CC_out: 25, range: [0, 127] },
                { name: "Param8", CC_in: 87, CC_out: 26, range: [0, 127] }
                // Add other parameters as needed
            ]
        },
        {
            pageNum: 2,
            pagelabel: "Effects",
            parameters: [
                { name: "Param3", CC_in: 82, CC_out: 92, range: [0, 127] },
                { name: "Param4", CC_in: 83, CC_out: 93, range: [0, 127] }
                // Add other parameters as needed
            ]
        }
        // Add other pages as needed
    ]
};
