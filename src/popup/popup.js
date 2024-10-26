import { notation, defaultHighlightSheet, defaultRestSheet } from "../utils.js";

// Element references
const elements = {
  applyButton: document.getElementById("applyButton"),
  autoButton: document.getElementById("autoButton"),
  restoreButton: document.getElementById("restore-button"),
  highlightInput: document.getElementById("highlight-input"),
  restInput: document.getElementById("rest-input"),
  output1: document.getElementById("v1"),
  output2: document.getElementById("v2"),
};

const classes = {
  enabled: "btn btn-light btn-sm",
  disabled: "btn btn-danger btn-sm",
};

// Initialize input and output with default values
function initValues() {
  updateUI(defaultHighlightSheet, defaultRestSheet);
}

// Update UI elements based on values
function updateUI(highlight, rest) {
  elements.highlightInput.value = highlight;
  elements.restInput.value = rest;
  elements.output1.textContent = highlight;
  elements.output2.textContent = `${rest}%`;
}

// Toggle button text and class for auto apply
function toggleAutoApplyButton(isAuto) {
  elements.autoButton.textContent = isAuto ? "Disable Auto Apply" : "Enable Auto Apply";
  elements.autoButton.className = isAuto ? classes.disabled : classes.enabled;
}

// Extract numerical values from style strings
const extractValue = (str, regex) => {
  const match = str.match(regex);
  return match ? parseFloat(match[1]) : null;
};

// Load and apply stored settings
async function loadStoredValues() {
  const { highlightSheet, restSheet, autoApply } = await chrome.storage.sync.get([
    "highlightSheet", 
    "restSheet", 
    "autoApply",
  ]);

  const fontWeight = extractValue(highlightSheet, /font-weight:\s*(\d+);/) || defaultHighlightSheet;
  const opacity = (extractValue(restSheet, /opacity:\s*(\d+(?:\.\d+)?);/) || defaultRestSheet / 100) * 100;

  updateUI(fontWeight, opacity);
  toggleAutoApplyButton(autoApply);
}

// Store new style values and update output
async function updateStyle(key, input, output, transform = (v) => v) {
  const value = input.value;
  await chrome.storage.sync.set({ [key]: transform(value) });
  output.textContent = value;
}

// Event listener for highlight input change
elements.highlightInput.addEventListener("input", () =>
  updateStyle("highlightSheet", elements.highlightInput, elements.output1, (v) => `font-weight: ${v};`)
);

// Event listener for rest input change
elements.restInput.addEventListener("input", () =>
  updateStyle("restSheet", elements.restInput, elements.output2, (v) => `opacity: ${v / 100};`)
);

// Restore default values
elements.restoreButton.addEventListener("click", async () => {
  await chrome.storage.sync.set({
    highlightSheet: `font-weight: ${defaultHighlightSheet};`,
    restSheet: `opacity: ${defaultRestSheet / 100};`,
  });
  initValues();
});

// Apply custom styles to the active tab
elements.applyButton.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: notation });

  const { isOn } = await chrome.storage.sync.get("isOn");
  await chrome.storage.sync.set({ isOn: !isOn });
});

// Toggle auto-apply setting
elements.autoButton.addEventListener("click", async () => {
  const { autoApply } = await chrome.storage.sync.get("autoApply");
  const newAutoApply = !autoApply;
  await chrome.storage.sync.set({ autoApply: newAutoApply });
  toggleAutoApplyButton(newAutoApply);
});

// Initialize auto-apply button on load
async function initAutoApply() {
  const { autoApply } = await chrome.storage.sync.get("autoApply");
  toggleAutoApplyButton(autoApply);
}

// Initialize everything
initValues();
loadStoredValues();
initAutoApply();
