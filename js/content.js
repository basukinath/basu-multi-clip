// Content script for CopyStack

// Listen for copy events
document.addEventListener('copy', function(e) {
  try {
    // Get the selected text
    const selectedText = window.getSelection().toString().trim();
    
    // If there's selected text, send it to the background script
    if (selectedText) {
      chrome.runtime.sendMessage({
        action: "textCopied",
        text: selectedText
      }, function(response) {
        // Handle any errors silently
        if (chrome.runtime.lastError) {
          console.debug('CopyStack: Error sending message:', chrome.runtime.lastError);
        }
      });
    }
  } catch (error) {
    console.debug('CopyStack: Error handling copy event:', error);
  }
});

// Also listen for cut events to handle clipboard operations
document.addEventListener('cut', function(e) {
  try {
    const selectedText = window.getSelection().toString().trim();
    
    if (selectedText) {
      chrome.runtime.sendMessage({
        action: "textCopied",
        text: selectedText
      }, function(response) {
        if (chrome.runtime.lastError) {
          console.debug('CopyStack: Error sending message:', chrome.runtime.lastError);
        }
      });
    }
  } catch (error) {
    console.debug('CopyStack: Error handling cut event:', error);
  }
}); 