import {
  notation,
  patternsInclude,
  defaultHighlightSheet,
  defaultRestSheet,
  defaultAlgorithm,
} from "./utils.js";

// Listener for when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    highlightSheet: `font-weight: ${defaultHighlightSheet};`,
    restSheet: `opacity: ${defaultRestSheet / 100};`,
    autoApply: false,
    excludedPatterns: [],
    algorithm: defaultAlgorithm,
  });
});

// Listener for when a tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status == "complete") {
    // Get the autoApply and excludedPatterns data from storage
    chrome.storage.sync.get(["autoApply", "excludedPatterns"], async (data) => {
      if (data.autoApply) {
        // Get the tab details
        let tab = await chrome.tabs.get(tabId);
        // Check if the tab URL is not in the excluded patterns
        if (!patternsInclude(data.excludedPatterns, tab.url)) {
          // Execute the notation function in the tab
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: notation,
          });
        }
      }
    });
  }
});

// Listener for when a command is triggered
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "toggle-auto-notation") {
    // Toggle the autoApply value in storage and update the command status
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
    // Get the active tab
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Execute the notation function in the tab
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: notation,
    });
  }
});