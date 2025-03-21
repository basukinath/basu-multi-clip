// Background script for CopyStack

// Initialize context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copy-to-stack",
    title: "Copy to CopyStack",
    contexts: ["selection"]
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copy-to-stack" && info.selectionText) {
    saveToClipboardHistory(info.selectionText);
  }
});

// Function to save text to clipboard history
function saveToClipboardHistory(text) {
  // Get current date and time
  const timestamp = new Date().toISOString();
  const clipItem = {
    text: text,
    timestamp: timestamp,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
  };

  // Get existing clipboard items from storage
  chrome.storage.local.get(['clipboardHistory'], (result) => {
    let clipboardHistory = result.clipboardHistory || [];
    
    // Check if this exact text already exists in history
    const existingIndex = clipboardHistory.findIndex(item => item.text === text);
    
    // If it exists, remove it (we'll add it again at the top)
    if (existingIndex !== -1) {
      clipboardHistory.splice(existingIndex, 1);
    }
    
    // Add new item at the beginning (most recent first)
    clipboardHistory.unshift(clipItem);
    
    // Store updated history
    chrome.storage.local.set({ clipboardHistory: clipboardHistory });
  });
}

// Listen for copy events from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "textCopied" && message.text) {
    saveToClipboardHistory(message.text);
    sendResponse({ status: "success" });
  }
  return true;
}); 