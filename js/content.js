// Content script for CopyStack

// Listen for copy events
document.addEventListener('copy', function(e) {
  // Get the selected text
  const selectedText = window.getSelection().toString();
  
  // If there's selected text, send it to the background script
  if (selectedText) {
    chrome.runtime.sendMessage({
      action: "textCopied",
      text: selectedText
    });
  }
}); 