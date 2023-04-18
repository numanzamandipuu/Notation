  import {
    noranic,
    defaultHighlightSheet,
    defaultRestSheet,
  } from "../utils.js";
  
  let applyButton = document.getElementById("applyButton");
  let autoButton = document.getElementById("autoButton");
  let restoreButton = document.getElementById("restore-button");
  let highlightSheetInput = document.getElementById("highlight-input");
  let restSheetInput = document.getElementById("rest-input");
  
  var buttonEnabledClass = "button-enabled btn btn-light btn-sm";
  var buttonDisabledClass = "button-disabled btn btn-danger btn-sm";
  let output1 = document.getElementById("v1");
  let output2 = document.getElementById("v2");
  
  function setClass(element, cls) {
    element.className = cls;
  }
  
  function updateAutoApplyText(isAuto) {
    if (isAuto) {
      autoButton.innerText = "Disable Auto Apply";
      setClass(autoButton, buttonDisabledClass);
    } else {
      autoButton.innerText = "Enable Auto Apply";
      setClass(autoButton, buttonEnabledClass);
    }
  }
  
  chrome.storage.sync.get(
    ["highlightSheet", "restSheet", "autoApply", "isOn", "algorithm"],
    (data) => {
      highlightSheetInput.value = data.highlightSheet;
      restSheetInput.value = data.restSheet;
      output1.innerHTML = highlightSheetInput.value;
      output2.innerHTML = data.restSheet + "%";
      updateAutoApplyText(data.autoApply);
    }
  );
  
  
  highlightSheetInput. addEventListener("input", async () => {
    onHighlightInputChange ();
  });
  
  restSheetInput. addEventListener("input", async () => {
    onRestInputChange();
  });
  
  
  restoreButton.addEventListener("click", async () => {
    chrome.storage.sync.set({
      highlightSheet: defaultHighlightSheet,
      restSheet: defaultRestSheet,
    });
    highlightSheetInput.value = defaultHighlightSheet;
    restSheetInput.value = defaultRestSheet;
    output1.innerHTML = fontWeightValue;
  });
  
  function updatenoranicToggle(isOn) {
    if (isOn) {
      applyButton.innerText = "noranic: On";
      setClass(applyButton, buttonEnabledClass);
    } else {
      applyButton.innerText = "noranic: Off";
      setClass(applyButton, buttonDisabledClass);
    }
  }
  
  applyButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: noranic,
    });
    chrome.storage.sync.get(["isOn"], (data) => {
      // updatenoranicToggle(!data.isOn);
      chrome.storage.sync.set({ isOn: !data.isOn });
    });
  });
  
  autoButton.addEventListener("click", async () => {
    chrome.storage.sync.get(["autoApply"], (data) => {
      updateAutoApplyText(!data.autoApply);
      chrome.storage.sync.set({ autoApply: !data.autoApply });
    });
  });
  
  
  function onHighlightInputChange () {
    let fontWeightValue = highlightSheetInput.value;
    let highlightSheetValue = `font-weight: ${fontWeightValue};`;
    chrome.storage.sync.set({ highlightSheet: highlightSheetValue });
    output1.innerHTML = fontWeightValue;
  }
  
  function onRestInputChange() {
    chrome.storage.sync.set({ restSheet: restSheetInput.value });
    output2.innerHTML = restSheetInput.value + "%";
  }
  
  