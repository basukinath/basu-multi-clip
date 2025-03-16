# CopyStack

CopyStack is a Chrome extension that enhances your clipboard experience by storing multiple copied texts, allowing you to access your clipboard history easily.

## Features

- **Multiple Clipboard Items**: Store multiple copied texts instead of just the latest one
- **Persistent Storage**: Clipboard items are saved even after closing the browser
- **Search Functionality**: Easily search through your clipboard history
- **Filtering Options**: Filter clipboard items by date (today, yesterday, this week, this month)
- **Copy & Delete**: Quickly copy items back to your clipboard or delete them when no longer needed
- **Clear All**: Option to clear all clipboard items at once

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the folder containing this extension
5. The CopyStack extension should now be installed and visible in your Chrome toolbar

## How to Use

1. **Copying Text**: Simply select text on any webpage and copy it (Ctrl+C or right-click > Copy). CopyStack will automatically save it to your clipboard history.
2. **Accessing Clipboard History**: Click on the CopyStack icon in your Chrome toolbar to open the popup with your clipboard history.
3. **Searching**: Use the search box to find specific clipboard items.
4. **Filtering**: Click the "Filter" button to filter items by date.
5. **Copying Items**: Click the "Copy" button on any clipboard item to copy it back to your clipboard.
6. **Deleting Items**: Click the "Delete" button to remove a specific clipboard item.
7. **Clearing All**: Click the "Clear All" button to remove all clipboard items.

## Notes

- The extension requires the "storage", "clipboardRead", "clipboardWrite", and "activeTab" permissions to function properly.
- Clipboard items are stored in your browser's local storage and are not sent to any external servers.

## Future Enhancements

- Batch deletion by date range
- Keyboard shortcuts for quick access
- Categorization of clipboard items
- Cloud sync across devices

## License

This project is open source and available under the MIT License. 