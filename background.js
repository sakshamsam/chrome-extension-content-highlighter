// Background script for the extension

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Smart Content Highlighter installed")

  // Set default settings
  chrome.storage.sync.set({
    enabled: true,
    highlightColor: "#FFFF00",
    highlightOpacity: 0.5,
  })
})

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getSettings") {
    chrome.storage.sync.get(["enabled", "highlightColor", "highlightOpacity"], (result) => {
      sendResponse(result)
    })
    return true // Required for async sendResponse
  }

  if (message.action === "updateSettings") {
    chrome.storage.sync.set(message.settings, () => {
      sendResponse({ success: true })
    })
    return true // Required for async sendResponse
  }
})

