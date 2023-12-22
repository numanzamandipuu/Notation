import { notation, defaultHighlightSheet, defaultRestSheet } from "../utils.js";

const applyButton = document.getElementById("applyButton");
const autoButton = document.getElementById("autoButton");
const restoreButton = document.getElementById("restore-button");
const highlightSheetInput = document.getElementById("highlight-input");
const restSheetInput = document.getElementById("rest-input");

const buttonEnabledClass = "btn btn-light btn-sm";
const buttonDisabledClass = "btn btn-danger btn-sm";
const output1 = document.getElementById("v1");
const output2 = document.getElementById("v2");

// Initialize input values and output displays
function initValues() {
  highlightSheetInput.value = defaultHighlightSheet;
  restSheetInput.value = defaultRestSheet;
  output1.innerHTML = defaultHighlightSheet;
  output2.innerHTML = `${defaultRestSheet}%`;
}

initValues();

// Update class helper function
function setClass(element, cls) {
  element.className = cls;
}

// Update the text and class of the auto apply button
function updateAutoApplyText(isAuto) {
  autoButton.innerHTML = isAuto ? "Disable Auto Apply" : "Enable Auto Apply";
  setClass(autoButton, isAuto ? buttonDisabledClass : buttonEnabledClass);
}

// Helper to extract style values from a stored string
function extractStyleValue(styleString, regex) {
  const match = styleString.match(regex);
  return match ? parseInt(match[1], 10) : null;
}

// Load the stored values and update the display
async function loadStoredValues() {
  const { highlightSheet, restSheet, autoApply } = await chrome.storage.sync.get(["highlightSheet", "restSheet", "autoApply"]);
  const fontWeightValue = extractStyleValue(highlightSheet, /font-weight:\s*(\d+);/);
  const opacityValue = extractStyleValue(restSheet, /opacity:\s*(\d+(?:\.\d+)?);/) * 100;

  highlightSheetInput.value = fontWeightValue || defaultHighlightSheet;
  restSheetInput.value = opacityValue || defaultRestSheet;
  output1.innerHTML = fontWeightValue || defaultHighlightSheet;
  output2.innerHTML = `${opacityValue || defaultRestSheet}%`;
  updateAutoApplyText(autoApply);
}

loadStoredValues();

// Update storage with new style value
async function setStyleValue(styleKey, inputElement, outputElement, transformFunction = value => value) {
  const value = inputElement.value;
  const styleValue = transformFunction(value);
  await chrome.storage.sync.set({ [styleKey]: styleValue });
  outputElement.textContent = value;
}

// Event listeners for input changes
highlightSheetInput.addEventListener("input", () => {
  setStyleValue('highlightSheet', highlightSheetInput, output1, fontWeightValue => `font-weight: ${fontWeightValue};`);
});

restSheetInput.addEventListener("input", () => {
  setStyleValue('restSheet', restSheetInput, output2, opacityValue => `opacity: ${opacityValue / 100};`);
});

// Restore button functionality
restoreButton.addEventListener("click", async () => {
  await chrome.storage.sync.set({
    highlightSheet: `font-weight: ${defaultHighlightSheet};`,
    restSheet: `opacity: ${defaultRestSheet / 100};`,
  });
  initValues();
});

// Apply the custom styles by invoking the notation function
applyButton.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: notation,
  });

  const { isOn } = await chrome.storage.sync.get("isOn");
  await chrome.storage.sync.set({ isOn: !isOn });
});

// Toggle the auto-apply functionality and update button text and class
autoButton.addEventListener("click", async () => {
  const { autoApply } = await chrome.storage.sync.get("autoApply");
  const newAutoApplyValue = !autoApply;
  await chrome.storage.sync.set({ autoApply: newAutoApplyValue });
  updateAutoApplyText(newAutoApplyValue);
});

// Initialize the auto-apply button text and class on load
async function initAutoApply() {
  const { autoApply } = await chrome.storage.sync.get("autoApply");
  updateAutoApplyText(autoApply);
}

initAutoApply();

// Update the highlight style value when the input changes
function onHighlightInputChange() {
  setStyleValue(
    'highlightSheet',
    highlightSheetInput,
    output1,
    fontWeightValue => `font-weight: ${fontWeightValue};`
  );
}

// Update the rest style value when the input changes
function onRestInputChange() {
  setStyleValue(
    'restSheet',
    restSheetInput,
    output2,
    opacityValue => `opacity: ${opacityValue / 100};`,
    value => `${value}%`
  );
}