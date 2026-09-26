// Helper for robust messaging to content script
function safeSendMessage(tabId, message) {
  chrome.tabs.sendMessage(tabId, message, (response) => {
    if (chrome.runtime.lastError) {
      console.warn('Message failed:', chrome.runtime.lastError.message);
    }
  });
}

import { sassifyText } from '../utils/api.js';

// Track enabled state
let extensionEnabled = true;

// Listen for enable/disable messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SET_ENABLED') {
    extensionEnabled = message.isEnabled;
    if (extensionEnabled) {
      // Get the current active tab and refresh it
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs.length > 0) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
    } else {
      // Optionally remove overlays or cleanup
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs.length > 0) {
          safeSendMessage(tabs[0].id, { type: 'DISABLE_OVERLAY' });
        }
      });
    }
  }
});

// Listen for new tab creation and refresh if enabled
chrome.tabs.onCreated.addListener((tab) => {
  if (extensionEnabled && tab.id && tab.url && /^https?:/.test(tab.url)) {
    chrome.tabs.reload(tab.id);
  }
});
// Create context menu on extension startup
chrome.runtime.onStartup.addListener(createContextMenu);
chrome.runtime.onInstalled.addListener(createContextMenu);

function createContextMenu() {
  chrome.contextMenus.remove('make-it-sassy', () => {
    chrome.contextMenus.create({
      id: 'make-it-sassy',
      title: 'Make it Sassy',
      contexts: ['selection']
    });
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'make-it-sassy' && info.selectionText) {
    try {
      // Get user preferences
      const result = await chrome.storage.sync.get(['sassLevel', 'apiKey']);
      const sassLevel = result.sassLevel || 'Witty Remark';
      const apiKey = result.apiKey;

      if (!apiKey) {
        safeSendMessage(tab.id, {
          type: 'SASS_ERROR',
          error: 'Please set your Gemini API key in the extension popup.'
        });
        return;
      }

      // Sassy rephrasing
      const sassyText = await sassifyText(info.selectionText, sassLevel, apiKey);

      // Send result to content script
      safeSendMessage(tab.id, {
        type: 'SASS_RESULT',
        originalText: info.selectionText,
        sassyText: sassyText
      });
    } catch (error) {
      safeSendMessage(tab.id, {
        type: 'SASS_ERROR',
        error: error.message
      });
    }
  }
});
