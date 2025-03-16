// Popup script for CopyStack

document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const clipsContainer = document.getElementById('clips-container');
  const emptyState = document.getElementById('empty-state');
  const clearAllBtn = document.getElementById('clear-all');
  const searchInput = document.getElementById('search-input');
  const filterButton = document.getElementById('filter-button');
  const filterOptions = document.getElementById('filter-options');
  
  // Current filter
  let currentFilter = 'all';
  
  // Load and display clipboard items
  loadClipboardItems();
  
  // Event listeners
  clearAllBtn.addEventListener('click', clearAllClips);
  searchInput.addEventListener('input', filterClipsBySearch);
  filterButton.addEventListener('click', toggleFilterDropdown);
  
  // Add event listeners to filter options
  document.querySelectorAll('#filter-options a').forEach(option => {
    option.addEventListener('click', function(e) {
      e.preventDefault();
      currentFilter = this.getAttribute('data-filter');
      filterButton.textContent = this.textContent;
      loadClipboardItems();
      toggleFilterDropdown();
    });
  });
  
  // Close the dropdown when clicking outside
  window.addEventListener('click', function(e) {
    if (!e.target.matches('#filter-button')) {
      filterOptions.classList.remove('show');
    }
  });
  
  // Function to load clipboard items
  function loadClipboardItems() {
    chrome.storage.local.get(['clipboardHistory'], function(result) {
      const clipboardHistory = result.clipboardHistory || [];
      
      // Clear the container except for the empty state
      while (clipsContainer.firstChild) {
        if (clipsContainer.firstChild === emptyState) break;
        clipsContainer.removeChild(clipsContainer.firstChild);
      }
      
      // Filter items based on current filter
      const filteredItems = filterItemsByDate(clipboardHistory, currentFilter);
      
      // Show or hide empty state
      if (filteredItems.length === 0) {
        emptyState.style.display = 'block';
      } else {
        emptyState.style.display = 'none';
        
        // Add each clip item to the container
        filteredItems.forEach((item, index) => {
          const clipElement = createClipElement(item, index);
          clipsContainer.insertBefore(clipElement, emptyState);
        });
      }
    });
  }
  
  // Function to create a clip element
  function createClipElement(item, index) {
    const clipItem = document.createElement('div');
    clipItem.className = 'clip-item';
    clipItem.dataset.index = index;
    
    const clipContent = document.createElement('div');
    clipContent.className = 'clip-content';
    clipContent.textContent = item.text;
    
    const clipMeta = document.createElement('div');
    clipMeta.className = 'clip-meta';
    clipMeta.innerHTML = `<span>${item.date} at ${item.time}</span>`;
    
    const clipActions = document.createElement('div');
    clipActions.className = 'clip-actions';
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', function() {
      copyToClipboard(item.text);
    });
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', function() {
      deleteClip(index);
    });
    
    clipActions.appendChild(copyBtn);
    clipActions.appendChild(deleteBtn);
    
    clipItem.appendChild(clipContent);
    clipItem.appendChild(clipMeta);
    clipItem.appendChild(clipActions);
    
    return clipItem;
  }
  
  // Function to copy text to clipboard
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      // Show a brief "Copied!" message
      const notification = document.createElement('div');
      notification.textContent = 'Copied!';
      notification.style.position = 'fixed';
      notification.style.top = '10px';
      notification.style.left = '50%';
      notification.style.transform = 'translateX(-50%)';
      notification.style.backgroundColor = '#2ecc71';
      notification.style.color = 'white';
      notification.style.padding = '8px 16px';
      notification.style.borderRadius = '4px';
      notification.style.zIndex = '1000';
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 1500);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  }
  
  // Function to delete a clip
  function deleteClip(index) {
    chrome.storage.local.get(['clipboardHistory'], function(result) {
      let clipboardHistory = result.clipboardHistory || [];
      
      // If we're filtering, we need to find the actual index in the full array
      if (currentFilter !== 'all') {
        const filteredItems = filterItemsByDate(clipboardHistory, currentFilter);
        const itemToDelete = filteredItems[index];
        index = clipboardHistory.findIndex(item => 
          item.timestamp === itemToDelete.timestamp && 
          item.text === itemToDelete.text
        );
      }
      
      // Remove the item
      clipboardHistory.splice(index, 1);
      
      // Save the updated history
      chrome.storage.local.set({ clipboardHistory: clipboardHistory }, function() {
        loadClipboardItems();
      });
    });
  }
  
  // Function to clear all clips
  function clearAllClips() {
    if (confirm('Are you sure you want to clear all clipboard items?')) {
      chrome.storage.local.set({ clipboardHistory: [] }, function() {
        loadClipboardItems();
      });
    }
  }
  
  // Function to filter clips by search term
  function filterClipsBySearch() {
    const searchTerm = searchInput.value.toLowerCase();
    
    chrome.storage.local.get(['clipboardHistory'], function(result) {
      const clipboardHistory = result.clipboardHistory || [];
      
      // First filter by date
      let filteredItems = filterItemsByDate(clipboardHistory, currentFilter);
      
      // Then filter by search term
      if (searchTerm) {
        filteredItems = filteredItems.filter(item => 
          item.text.toLowerCase().includes(searchTerm)
        );
      }
      
      // Clear the container except for the empty state
      while (clipsContainer.firstChild) {
        if (clipsContainer.firstChild === emptyState) break;
        clipsContainer.removeChild(clipsContainer.firstChild);
      }
      
      // Show or hide empty state
      if (filteredItems.length === 0) {
        emptyState.style.display = 'block';
      } else {
        emptyState.style.display = 'none';
        
        // Add each clip item to the container
        filteredItems.forEach((item, index) => {
          const clipElement = createClipElement(item, index);
          clipsContainer.insertBefore(clipElement, emptyState);
        });
      }
    });
  }
  
  // Function to toggle filter dropdown
  function toggleFilterDropdown() {
    filterOptions.classList.toggle('show');
  }
  
  // Function to filter items by date
  function filterItemsByDate(items, filter) {
    if (filter === 'all') return items;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return items.filter(item => {
      const itemDate = new Date(item.timestamp);
      
      switch (filter) {
        case 'today':
          return itemDate >= today;
        case 'yesterday':
          return itemDate >= yesterday && itemDate < today;
        case 'week':
          return itemDate >= startOfWeek;
        case 'month':
          return itemDate >= startOfMonth;
        default:
          return true;
      }
    });
  }
}); 