let currentMidiInValues = {}; // Raw encoder (MIDI) values
let storedValues = {};        // Saved (program dump) values for each page
let midiOut, selectedTab = 0;
let syncFlags = {};           // When true, the displayed value is “in sync” with the encoder

// ---------------------------------------------------------------------------
// INIT PROGRAM DUMP
// ---------------------------------------------------------------------------
// This simulates loading a Sysex program dump.
// For any parameter that defines a range, we take its default as the minimum of that range.
function initProgramDump() {
  // Assume midiConfig.pages is defined in config.js.
  midiConfig.pages.forEach((page, pageIndex) => {
    storedValues[pageIndex] = {};
    page.parameters.forEach(param => {
      let defaultVal = 0;
      if (param.range && param.range.length === 2) {
        defaultVal = param.range[0]; // use the minimum of the defined range
      }
      storedValues[pageIndex][param.CC_in] = defaultVal;
    });
  });
}

// ---------------------------------------------------------------------------
// UTILITY: Clamp a value based on a parameter’s defined range.
function clampValue(value, parameter) {
  if (parameter.range && parameter.range.length === 2) {
    const [min, max] = parameter.range;
    return Math.max(min, Math.min(max, value));
  }
  return value;
}

// ---------------------------------------------------------------------------
// INIT MIDI
async function initMIDI() {
  try {
    const access = await navigator.requestMIDIAccess();
    for (const input of access.inputs.values()) {
      input.onmidimessage = handleMIDIMessage;
    }
    midiOut = access.outputs.values().next().value;
    console.log("MIDI initialized");
  } catch (error) {
    console.error("Failed to access Web MIDI API:", error);
  }
}

// ---------------------------------------------------------------------------
// MIDI Message Handler
function handleMIDIMessage(message) {
  const [status, ccNumber, rawValue] = message.data;
  // Process only Control Change messages (status 176–191)
  if (status >= 176 && status <= 191) {
    const parameter = midiConfig.pages[selectedTab].parameters.find(param => param.CC_in === ccNumber);
    if (parameter) {
      // Record the raw encoder value.
      currentMidiInValues[ccNumber] = rawValue;

      // Clamp incoming value according to the parameter’s range.
      const clampedValue = clampValue(rawValue, parameter);

      if (syncFlags[ccNumber]) {
        // If already in sync, update the displayed value.
        storedValues[selectedTab][ccNumber] = clampedValue;
        const valueElem = document.getElementById(`value-${ccNumber}`);
        if (valueElem) valueElem.innerText = clampedValue;
        sendMIDIOut(parameter, clampedValue);
      } else if (clampedValue === storedValues[selectedTab][ccNumber]) {
        // When encoder value equals saved value, mark as synced.
        syncFlags[ccNumber] = true;
        const valueElem = document.getElementById(`value-${ccNumber}`);
        if (valueElem) valueElem.innerText = clampedValue;
        sendMIDIOut(parameter, clampedValue);
        updateSliders(ccNumber); // This will hide both sliders.
      } else {
        // Otherwise, update the sliders to show the difference.
        updateSliders(ccNumber);
      }

      updateCurrentValueDisplay(ccNumber, rawValue);
    }
  }
}

// ---------------------------------------------------------------------------
// Send MIDI Out based on parameter settings.
function sendMIDIOut(parameter, value) {
  if (midiOut) {
    if (parameter.isNRPN) {
      const [msb, lsb] = parameter.NRPN_val.split(':').map(Number);
      const valueMsb = ((value * 129) >> 7) & 0x7F;
      const valueLsb = (value * 129) & 0x7F;
      midiOut.send([176, 99, msb]);
      midiOut.send([176, 98, lsb]);
      midiOut.send([176, 6, valueMsb]);
      midiOut.send([176, 38, valueLsb]);
      midiOut.send([176, 101, 127]);
      midiOut.send([176, 100, 127]);
    } else {
      midiOut.send([176, parameter.CC_out, value]);
    }
  }
}

// ---------------------------------------------------------------------------
// Change Tab (Page)
// Build the UI for a given page using the saved (program dump) values.
function changeTab(pageIndex) {
  selectedTab = pageIndex;
  const tabContent = document.getElementById('content');
  tabContent.innerHTML = '';
  syncFlags = {}; // Reset sync flags on page change

  const parameters = midiConfig.pages[pageIndex].parameters;

  // Build two rows (similar to your original layout)
  // FIRST ROW:
  for (let i = 0; i < 8; i++) {
    let cell;
    if (i % 2 === 0) {
      cell = document.createElement('div');
      cell.className = 'empty';
    } else {
      const paramIndex = Math.floor(i / 2);
      if (paramIndex < Math.ceil(parameters.length / 2)) {
        const param = parameters[paramIndex];
        const cc = param.CC_in;
        // Instead of defaulting current value to 0, set it to the saved value.
        if (currentMidiInValues[cc] === undefined) {
          currentMidiInValues[cc] = storedValues[pageIndex][cc];
        }
        const displayVal = storedValues[pageIndex][cc] !== undefined ? storedValues[pageIndex][cc] : 0;
        cell = document.createElement('div');
        cell.className = 'parameter';
        cell.innerHTML = `
          <div class="parameter-value" id="paramvalue-${cc}">
            <div class="displayed-number" id="value-${cc}">${displayVal}</div>
            <div class="sliders">
              <div class="left-slider-container" id="left-slider-${cc}">
                <div class="left-slider-fill" id="left-slider-fill-${cc}"></div>
              </div>
              <div class="right-slider-container" id="right-slider-${cc}">
                <div class="right-slider-fill" id="right-slider-fill-${cc}"></div>
              </div>
            </div>
          </div>
          <div class="parameter-label">${param.name}</div>
        `;
      } else {
        cell = document.createElement('div');
        cell.className = 'empty';
      }
    }
    tabContent.appendChild(cell);
  }

  // SECOND ROW:
  for (let i = 0; i < 8; i++) {
    let cell;
    if (i % 2 === 1) {
      cell = document.createElement('div');
      cell.className = 'empty';
    } else {
      const paramIndex = Math.floor(i / 2) + Math.ceil(parameters.length / 2);
      if (paramIndex < parameters.length) {
        const param = parameters[paramIndex];
        const cc = param.CC_in;
        if (currentMidiInValues[cc] === undefined) {
          currentMidiInValues[cc] = storedValues[pageIndex][cc];
        }
        const displayVal = storedValues[pageIndex][cc] !== undefined ? storedValues[pageIndex][cc] : 0;
        cell = document.createElement('div');
        cell.className = 'parameter';
        cell.innerHTML = `
          <div class="parameter-value" id="paramvalue-${cc}">
            <div class="displayed-number" id="value-${cc}">${displayVal}</div>
            <div class="sliders">
              <div class="left-slider-container" id="left-slider-${cc}">
                <div class="left-slider-fill" id="left-slider-fill-${cc}"></div>
              </div>
              <div class="right-slider-container" id="right-slider-${cc}">
                <div class="right-slider-fill" id="right-slider-fill-${cc}"></div>
              </div>
            </div>
          </div>
          <div class="parameter-label">${param.name}</div>
        `;
      } else {
        cell = document.createElement('div');
        cell.className = 'empty';
      }
    }
    tabContent.appendChild(cell);
  }

  // Update sliders for all parameters on the current page.
  parameters.forEach(param => updateSliders(param.CC_in));
  resetCurrentValueDisplay();
}

// ---------------------------------------------------------------------------
// Update Sliders
// For each parameter, there are two 60px‑wide rectangles below the displayed value.
// The left rectangle is used when the encoder (current) value is lower than the saved value,
// and its fill grows from right-to-left.
// The right rectangle is used when the encoder value is higher than the saved value,
// and its fill grows from left-to-right.
// The "full" fill is reached when the difference equals 50% of the parameter’s range.
function updateSliders(ccNumber) {
  const leftContainer = document.getElementById(`left-slider-${ccNumber}`);
  const rightContainer = document.getElementById(`right-slider-${ccNumber}`);
  const leftFill = document.getElementById(`left-slider-fill-${ccNumber}`);
  const rightFill = document.getElementById(`right-slider-fill-${ccNumber}`);
  if (!leftContainer || !rightContainer || !leftFill || !rightFill) return;

  const storedVal = storedValues[selectedTab][ccNumber];
  const currentVal = currentMidiInValues[ccNumber];
  if (storedVal === undefined || currentVal === undefined) {
    leftContainer.style.visibility = 'visible';
    rightContainer.style.visibility = 'visible';
    leftFill.style.width = '0%';
    rightFill.style.width = '0%';
    return;
  }

  // Lookup the parameter’s range to compute full-scale difference as 50% of the range.
  const parameter = midiConfig.pages[selectedTab].parameters.find(p => p.CC_in === ccNumber);
  let fullScale = 60; // fallback value
  if (parameter && parameter.range && parameter.range.length === 2) {
    const [min, max] = parameter.range;
    fullScale = (max - min) / 2;
  }

  const diff = currentVal - storedVal; // positive if encoder > saved; negative if encoder < saved.
  if (diff === 0) {
    // When equal, hide both slider containers.
    leftContainer.style.visibility = 'hidden';
    rightContainer.style.visibility = 'hidden';
    leftFill.style.width = '0%';
    rightFill.style.width = '0%';
  } else if (diff > 0) {
    // Encoder is higher than saved: use right slider.
    leftContainer.style.visibility = 'hidden';
    rightContainer.style.visibility = 'visible';
    let ratio = diff / fullScale;
    if (ratio > 1) ratio = 1;
    rightFill.style.width = `${ratio * 100}%`;
    leftFill.style.width = '0%';
  } else {
    // Encoder is lower than saved: use left slider.
    rightContainer.style.visibility = 'hidden';
    leftContainer.style.visibility = 'visible';
    let ratio = Math.abs(diff) / fullScale;
    if (ratio > 1) ratio = 1;
    leftFill.style.width = `${ratio * 100}%`;
    rightFill.style.width = '0%';
  }
}

// ---------------------------------------------------------------------------
// Update the "Current Value" display in the header.
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

// ---------------------------------------------------------------------------
// Create Tabs from midiConfig.pages.
function createTabs() {
  const tabsContainer = document.getElementById('tabs');
  tabsContainer.innerHTML = ''; // Clear any existing tabs.
  const sortedPages = midiConfig.pages.sort((a, b) => a.pageNum - b.pageNum);
  sortedPages.forEach((page, index) => {
    const tabButton = document.createElement('button');
    tabButton.innerText = page.pagelabel;
    tabButton.onclick = () => changeTab(index);
    tabsContainer.appendChild(tabButton);
  });
  console.log("Tabs created");
}

// ---------------------------------------------------------------------------
// Setup
document.addEventListener('DOMContentLoaded', () => {
  initProgramDump();
  createTabs();
  changeTab(0);
  initMIDI();
});
