let currentMidiInValues = {};
let storedValues = {};
let midiOut, selectedTab = 0;

async function initMIDI() {
    try {
        const access = await navigator.requestMIDIAccess();
        const inputs = access.inputs.values();
        for (let input of inputs) {
            input.onmidimessage = handleMIDIMessage;
        }
        const outputs = access.outputs.values();
        midiOut = outputs.next().value;
        console.log("MIDI initialized");
    } catch (error) {
        console.error("Failed to access Web MIDI API:", error);
    }
}

function handleMIDIMessage(message) {
    const [status, data1, data2] = message.data;
    if (status >= 176 && status <= 191) { // Control Change messages
        const parameter = midiConfig.pages[selectedTab].parameters.find(param => param.CC_in === data1);
        if (parameter) {
            currentMidiInValues[data1] = data2;
            storedValues[selectedTab] = storedValues[selectedTab] || {};
            storedValues[selectedTab][data1] = data2;
            document.getElementById(`value-${data1}`).innerText = data2;
            sendMIDIOut(parameter, data2);
        }
    }
}

function sendMIDIOut(parameter, value) {
    if (midiOut) {
        if (parameter.isNRPN) {
            const [msb, lsb] = parameter.NRPN_val.split(':').map(Number);
            const valueMsb = (value >> 7) & 0x7F;       // Value MSB
            const valueLsb = value & 0x7F;              // Value LSB

            midiOut.send([176, 99, msb]);   // NRPN MSB
            midiOut.send([176, 98, lsb]);   // NRPN LSB
            midiOut.send([176, 6, valueMsb]); // Data Entry MSB
            midiOut.send([176, 38, valueLsb]); // Data Entry LSB
            midiOut.send([176, 101, 127]);  // RPN MSB (null)
            midiOut.send([176, 100, 127]);  // RPN LSB (null)
        } else {
            midiOut.send([176, parameter.CC_out, value]);
        }
    }
}

function changeTab(pageIndex) {
    selectedTab = pageIndex;
    const tabContent = document.getElementById('content');
    tabContent.innerHTML = '';

    for (let i = 0; i < 8; i++) {
        // First row: first cell empty, then full
        if (i % 2 === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty';
            tabContent.appendChild(emptyDiv);
        } else if (i < midiConfig.pages[pageIndex].parameters.length) {
            const param = midiConfig.pages[pageIndex].parameters[i - (i + 1) / 2];
            const value = (storedValues[pageIndex] && storedValues[pageIndex][param.CC_in]) || 0;
            const paramDiv = document.createElement('div');
            paramDiv.className = 'parameter';
            paramDiv.innerHTML = `
                <div class="parameter-value" id="value-${param.CC_in}">${value}</div>
                <div class="parameter-label">${param.name}</div>
            `;
            paramDiv.id = `param-${param.CC_in}`;
            tabContent.appendChild(paramDiv);
        } else {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty';
            tabContent.appendChild(emptyDiv);
        }
    }

    for (let i = 0; i < 8; i++) {
        // Second row: first cell full, then empty
        if (i % 2 === 1) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty';
            tabContent.appendChild(emptyDiv);
        } else if (i / 2 < midiConfig.pages[pageIndex].parameters.length / 2) {
            const param = midiConfig.pages[pageIndex].parameters[4 + i / 2];
            const value = (storedValues[pageIndex] && storedValues[pageIndex][param.CC_in]) || 0;
            const paramDiv = document.createElement('div');
            paramDiv.className = 'parameter';
            paramDiv.innerHTML = `
                <div class="parameter-value" id="value-${param.CC_in}">${value}</div>
                <div class="parameter-label">${param.name}</div>
            `;
            paramDiv.id = `param-${param.CC_in}`;
            tabContent.appendChild(paramDiv);
        } else {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty';
            tabContent.appendChild(emptyDiv);
        }
    }

    console.log(`Changed to tab ${pageIndex}`);
}

function createTabs() {
    const tabsContainer = document.getElementById('tabs');
    const sortedPages = midiConfig.pages.sort((a, b) => a.pageNum - b.pageNum);
    sortedPages.forEach((page, index) => {
        const tabButton = document.createElement('button');
        tabButton.innerText = page.pagelabel;
        tabButton.onclick = () => changeTab(index);
        tabsContainer.appendChild(tabButton);
    });
    console.log("Tabs created");
}

document.addEventListener('DOMContentLoaded', () => {
    createTabs();
    changeTab(0);
    initMIDI();
});
