import {
  notation,
  patternsInclude,
  defaultHighlightSheet,
  defaultRestSheet,
  defaultAlgorithm,
} from "./utils.js";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    highlightSheet: `font-weight: ${defaultHighlightSheet};`,
    restSheet: `opacity: ${defaultRestSheet / 100};`,
    autoApply: false,
    excludedPatterns: [],
    algorithm: defaultAlgorithm,
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status == "complete") {
    chrome.storage.sync.get(["autoApply", "excludedPatterns"], async (data) => {
      if (data.autoApply) {
        let tab = await chrome.tabs.get(tabId);
        if (!patternsInclude(data.excludedPatterns, tab.url)) {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: notation,
          });
        }
      }
    });
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "toggle-auto-notation") {
    chrome.storage.sync.get(["autoApply"], (data) => {
      let autoApply = !data.autoApply;
      chrome.storage.sync.set({ autoApply: autoApply }, () => {
        chrome.commands.update({
          name: "toggle-auto-notation",
          checked: autoApply,
        });
      });
    });
  }
  if (command === "toggle-notation") {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: notation,
    });
  }
});
