// Popup script

// Load settings when popup opens
document.addEventListener("DOMContentLoaded", () => {
  // Get current settings
  chrome.runtime.sendMessage({ action: "getSettings" }, (response) => {
    document.getElementById("enabled").checked = response.enabled
    document.getElementById("highlightColor").value = response.highlightColor
    document.getElementById("highlightOpacity").value = response.highlightOpacity
    document.getElementById("opacityValue").textContent = response.highlightOpacity
  })

  // Update opacity value display when slider changes
  document.getElementById("highlightOpacity").addEventListener("input", function () {
    document.getElementById("opacityValue").textContent = this.value
  })

  // Save settings when Apply button is clicked
  document.getElementById("applyBtn").addEventListener("click", () => {
    const settings = {
      enabled: document.getElementById("enabled").checked,
      highlightColor: document.getElementById("highlightColor").value,
      highlightOpacity: document.getElementById("highlightOpacity").value,
    }

    // Save settings
    chrome.runtime.sendMessage(
      {
        action: "updateSettings",
        settings: settings,
      },
      () => {
		   console.log("Sending message to content script with settings:", settings);
        // Apply settings to current tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "updateHighlights",
            settings: settings,
          })
        })
      },
    )
  })
})

