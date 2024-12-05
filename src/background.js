import {
  notation,
  patternsInclude,
  defaultHighlightSheet,
  defaultRestSheet,
  defaultAlgorithm,
} from "./utils.js";

// Initialize default settings on extension installation
chrome.runtime.onInstalled.addListener(() =>
  chrome.storage.sync.set({
    highlightSheet: `font-weight: ${defaultHighlightSheet};`,
    restSheet: `opacity: ${defaultRestSheet / 100};`,
    autoApply: false,
    excludedPatterns: [],
    algorithm: defaultAlgorithm,
  })
);

// Automatically apply notation if conditions are met when a tab is updated
chrome.tabs.onUpdated.addListener((tabId, { status }) => {
  if (status === "complete") {
    chrome.storage.sync.get(["autoApply", "excludedPatterns"], async ({ autoApply, excludedPatterns }) => {
      if (autoApply) {
        const { url } = await chrome.tabs.get(tabId);
        if (!patternsInclude(excludedPatterns, url)) {
          chrome.scripting.executeScript({ target: { tabId }, function: notation });
        }
      }
    });
  }
});

// Handle keyboard commands
chrome.commands.onCommand.addListener(async (command) => {
  switch (command) {
    case "toggle-auto-notation":
      chrome.storage.sync.get("autoApply", ({ autoApply }) =>
        chrome.storage.sync.set({ autoApply: !autoApply })
      );
      break;

    case "toggle-notation":
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) chrome.scripting.executeScript({ target: { tabId: tab.id }, function: notation });
      break;
  }
});
