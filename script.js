let currentMidiInValues = {};
let storedValues = {};
let midiOut, selectedTab = 0;
let syncFlags = {}; // Flags to sync values when they match

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

            if (storedValues[selectedTab][data1] === undefined) {
                storedValues[selectedTab][data1] = data2; // Initialize stored value
            }

            if (syncFlags[data1]) {
                // Update displayed value when sync flag is true
                storedValues[selectedTab][data1] = data2;
                document.getElementById(`value-${data1}`).innerText = data2;
                sendMIDIOut(parameter, data2);
            } else if (data2 === storedValues[selectedTab][data1]) {
                // Set sync flag when values match
                syncFlags[data1] = true;
                document.getElementById(`value-${data1}`).innerText = data2;
                sendMIDIOut(parameter, data2);
            }

            // Update the triangle indicator
            updateTriangleIndicator(data1);

            // Update the current value display
            updateCurrentValueDisplay(data1, data2);
        }
    }
}

function sendMIDIOut(parameter, value) {
    if (midiOut) {
        if (parameter.isNRPN) {
            const [msb, lsb] = parameter.NRPN_val.split(':').map(Number);
            const valueMsb = ((value*129) >> 7) & 0x7F; // Value MSB
            const valueLsb = (value*129) & 0x7F; // Value LSB
            midiOut.send([176, 99, msb]); // NRPN MSB
            midiOut.send([176, 98, lsb]); // NRPN LSB
            midiOut.send([176, 6, valueMsb]); // Data Entry MSB
            midiOut.send([176, 38, valueLsb]); // Data Entry LSB
            midiOut.send([176, 101, 127]); // RPN MSB (null)
            midiOut.send([176, 100, 127]); // RPN LSB (null)
        } else {
            midiOut.send([176, parameter.CC_out, value]);
        }
    }
}

function changeTab(pageIndex) {
    selectedTab = pageIndex;
    const tabContent = document.getElementById('content');
    tabContent.innerHTML = '';
    syncFlags = {}; // Reset sync flags

    const parameters = midiConfig.pages[pageIndex].parameters;

    // First row: empty, parameter, empty, parameter, etc.
    for (let i = 0; i < 8; i++) {
        if (i % 2 === 0) {
            // Empty cell
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty';
            tabContent.appendChild(emptyDiv);
        } else {
            const paramIndex = Math.floor(i / 2);
            if (paramIndex < parameters.length / 2) {
                // Parameter cell
                const param = parameters[paramIndex];
                const value = storedValues[pageIndex]?.[param.CC_in] || 0;

                // Initialize currentMidiInValues if undefined
                if (currentMidiInValues[param.CC_in] === undefined) {
                    currentMidiInValues[param.CC_in] = 0;
                }

                const paramDiv = document.createElement('div');
                paramDiv.className = 'parameter';
                paramDiv.innerHTML = `
                    <div class="parameter-value">
                        <div id="value-${param.CC_in}">${value}</div>
                        <div class="triangle-indicator" id="triangle-${param.CC_in}"></div>
                    </div>
                    <div class="parameter-label">${param.name}</div>
                `;
                tabContent.appendChild(paramDiv);
            } else {
                // Empty cell
                const emptyDiv = document.createElement('div');
                emptyDiv.className = 'empty';
                tabContent.appendChild(emptyDiv);
            }
        }
    }

    // Second row: parameter, empty, parameter, empty, etc.
    for (let i = 0; i < 8; i++) {
        if (i % 2 === 1) {
            // Empty cell
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty';
            tabContent.appendChild(emptyDiv);
        } else {
            const paramIndex = Math.floor(i / 2) + 4;
            if (paramIndex < parameters.length) {
                // Parameter cell
                const param = parameters[paramIndex];
                const value = storedValues[pageIndex]?.[param.CC_in] || 0;

                // Initialize currentMidiInValues if undefined
                if (currentMidiInValues[param.CC_in] === undefined) {
                    currentMidiInValues[param.CC_in] = 0;
                }

                const paramDiv = document.createElement('div');
                paramDiv.className = 'parameter';
                paramDiv.innerHTML = `
                    <div class="parameter-value">
                        <div id="value-${param.CC_in}">${value}</div>
                        <div class="triangle-indicator" id="triangle-${param.CC_in}"></div>
                    </div>
                    <div class="parameter-label">${param.name}</div>
                `;
                tabContent.appendChild(paramDiv);
            } else {
                // Empty cell
                const emptyDiv = document.createElement('div');
                emptyDiv.className = 'empty';
                tabContent.appendChild(emptyDiv);
            }
        }
    }

    // Update triangle indicators for all parameters on page load
    parameters.forEach((param) => {
        updateTriangleIndicator(param.CC_in);
    });

    resetCurrentValueDisplay();
}

function updateTriangleIndicator(ccNumber) {
    const triangle = document.getElementById(`triangle-${ccNumber}`);
    if (triangle && storedValues[selectedTab]) {
        const storedValue = storedValues[selectedTab][ccNumber];
        let currentValue = currentMidiInValues[ccNumber];

        if (storedValue === undefined) {
            triangle.style.display = 'none';
            return;
        }

        if (currentValue === undefined) {
            // If currentValue is undefined, assume zero
            currentValue = 0;
        }

        if (currentValue > storedValue) {
            // User needs to turn encoder to the left (decrease value)
            // So we show left-pointing triangle
            triangle.className = 'triangle-indicator left';
            triangle.style.display = 'block';
        } else if (currentValue < storedValue) {
            // User needs to turn encoder to the right (increase value)
            // So we show right-pointing triangle
            triangle.className = 'triangle-indicator right';
            triangle.style.display = 'block';
        } else {
            triangle.style.display = 'none'; // Hide the triangle when values match
        }
    }
}

function updateCurrentValueDisplay(ccNumber, ccValue) {
    const currentValueElement = document.getElementById('current-value');
    if (currentValueElement) {
        currentValueElement.innerText = `Current Value: CC${ccNumber} = ${ccValue}`;
    }
}

function resetCurrentValueDisplay() {
    const currentValueElement = document.getElementById('current-value');
    if (currentValueElement) {
        currentValueElement.innerText = 'Current Value: N/A';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createTabs();
    changeTab(0);
    initMIDI();
});

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
