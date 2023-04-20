import {
  notation,
  defaultHighlightSheet,
  defaultRestSheet,
} from "../utils.js";

let applyButton = document.getElementById("applyButton");
let autoButton = document.getElementById("autoButton");
let restoreButton = document.getElementById("restore-button");
let highlightSheetInput = document.getElementById("highlight-input");
let restSheetInput = document.getElementById("rest-input");

var buttonEnabledClass = "btn btn-light btn-sm";
var buttonDisabledClass = "btn btn-danger btn-sm";
let output1 = document.getElementById("v1");
let output2 = document.getElementById("v2");

restSheetInput.value = defaultRestSheet;
output1.innerHTML = highlightSheetInput.value;
output2.innerHTML = restSheetInput.value + "%";

function setClass(element, cls) {
  element.className = cls;
}

function updateAutoApplyText(isAuto) {
  if (isAuto) {
    autoButton.innerHTML = "Disable Auto Apply";
    setClass(autoButton, buttonDisabledClass);
  } else {
    autoButton.innerHTML = "Enable Auto Apply";
    setClass(autoButton, buttonEnabledClass);
  }
}

chrome.storage.sync.get(
  ["highlightSheet", "restSheet", "autoApply", "isOn", "algorithm"],
  (data) => {
    highlightSheetInput.value = data.highlightSheet.split(":")[1].trim();
    restSheetInput.value = data.restSheet.split(":")[1].trim();
    output1.innerHTML = fontWeightValue;
    output2.innerHTML = opacityValue + "%";
    updateAutoApplyText(data.autoApply);
  }
);

chrome.storage.sync.get("highlightSheet", function(data) {
  let fontWeightValue = parseInt(data.highlightSheet.match(/\d+/)[0]);
  document.getElementById("highlight-input").value = fontWeightValue;
  output1.innerHTML = fontWeightValue;
});

chrome.storage.sync.get("restSheet", function(data) {
  let opacityValue = parseInt(data.restSheet.match(/opacity:\s*(\d+(?:\.\d+)?)/i)[1] * 100);
  document.getElementById("rest-input").value = opacityValue;
  output2.innerHTML = opacityValue + "%";
});

highlightSheetInput.addEventListener("input", async (text) => {
  onHighlightInputChange();
});

restSheetInput.addEventListener("input", async (text) => {
  onRestInputChange();
});


restoreButton.addEventListener("click", async () => {
  chrome.storage.sync.set({
    highlightSheet: `font-weight: ${defaultHighlightSheet};`,
    restSheet: `opacity: ${defaultRestSheet / 100};`,
  });
  highlightSheetInput.value = defaultHighlightSheet;
  restSheetInput.value = defaultRestSheet;
  output1.innerHTML = highlightSheetInput.value;
  output2.innerHTML = restSheetInput.value + "%";
});

applyButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: notation,
  });
  chrome.storage.sync.get(["isOn"], (data) => {
    chrome.storage.sync.set({ isOn: !data.isOn });
  });
});

autoButton.addEventListener("click", async () => {
  chrome.storage.sync.get(["autoApply"], (data) => {
    updateAutoApplyText(!data.autoApply);
    chrome.storage.sync.set({ autoApply: !data.autoApply });
  });
});

chrome.storage.sync.get("autoApply", (data) => {
  updateAutoApplyText(data.autoApply);
});

function onHighlightInputChange() {
  let fontWeightValue = highlightSheetInput.value;
  let highlightSheetValue = `font-weight: ${fontWeightValue};`;
  chrome.storage.sync.set({ highlightSheet: highlightSheetValue });
  output1.innerHTML = fontWeightValue;
}

function onRestInputChange() {
  let opacityValue = restSheetInput.value;
  let restSheetValue = `opacity: ${opacityValue / 100};`;
  chrome.storage.sync.set({ restSheet: restSheetValue});
  output2.innerHTML = opacityValue + "%";
}