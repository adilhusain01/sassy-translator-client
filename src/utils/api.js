/**
 * Configuration for different sass levels
 */
export const SASS_LEVELS = {
  'Subtle Chuckle': {
    prompt: 'witty, concise, with a playful nudge',
    description: 'Light humor with a cheeky twist'
  },
  'Witty Remark': {
    prompt: 'clever, sarcastic, short, with bold attitude',
    description: 'Smart, snappy, and full of personality'
  },
  'Full-Blown Sass': {
    prompt: 'sassy, sharp, dramatic, but super concise',
    description: 'Maximum attitude in minimal words'
  }
};

/**
 * Makes text sassy using Gemini API
 * @param {string} text - Text to sassify
 * @param {string} sassLevel - Level of sass to apply
 * @param {string} apiKey - Gemini API key
 * @returns {Promise<string>} - Sassy rephrased text
 */
export async function sassifyText(text, sassLevel, apiKey) {
  const sassPrompt = SASS_LEVELS[sassLevel]?.prompt || SASS_LEVELS['Witty Remark'].prompt;

  const prompt = `You are a sassy with a sharp tongue and a knack for flair. Your job is to:

1. Rephrase the text to be ${sassPrompt}, but keep it *concise* (under 10 words but in extreme times under 15).
2. Preserve the original meaning while adding bold, cheeky personality.
3. Make it fun, punchy, and slightly mischievous without being offensive.
4. Return ONLY the final sassy text, nothing else.

Text to rephrase: "${text}"

Example: If the text is "Hello", return something like "Yo, hotshot!" 
Be ${sassPrompt}, keep it short, and make it slay!`;

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    })
  });

  if (!response.ok) {
    throw new Error('Translation failed. Please check your API key.');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text.trim();
}

/**
 * Validates API key format (basic check)
 * @param {string} apiKey - API key to validate
 * @returns {boolean} - Whether the API key format looks valid
 */
export function validateApiKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }
  
  // Basic format check - Gemini API keys typically start with certain patterns
  return apiKey.length > 20 && /^[A-Za-z0-9_-]+$/.test(apiKey);
}

/**
 * Gets user preferences from Chrome storage
 * @returns {Promise<Object>} - User preferences
 */
export async function getUserPreferences() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['sassLevel', 'apiKey', 'isEnabled'], (result) => {
      resolve({
        sassLevel: result.sassLevel || 'Witty Remark',
        apiKey: result.apiKey || '',
        isEnabled: result.isEnabled !== false // Default to true
      });
    });
  });
}

/**
 * Saves user preferences to Chrome storage
 * @param {Object} preferences - Preferences to save
 * @returns {Promise<void>}
 */
export async function saveUserPreferences(preferences) {
  return new Promise((resolve) => {
    chrome.storage.sync.set(preferences, resolve);
  });
}

// Create context menu on extension startup
chrome.runtime.onStartup.addListener(createContextMenu);
chrome.runtime.onInstalled.addListener(createContextMenu);

function createContextMenu() {
  chrome.contextMenus.create({
    id: 'make-it-sassy',
    title: 'Make it Sassy',
    contexts: ['selection']
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
        chrome.tabs.sendMessage(tab.id, {
          type: 'SASS_ERROR',
          error: 'Please set your Gemini API key in the extension popup.'
        });
        return;
      }

      // Sassify the text
      const sassyText = await sassifyText(info.selectionText, sassLevel, apiKey);
      
      // Send result to content script
      chrome.tabs.sendMessage(tab.id, {
        type: 'SASS_RESULT',
        originalText: info.selectionText,
        sassyText: sassyText
      });
    } catch (error) {
      chrome.tabs.sendMessage(tab.id, {
        type: 'SASS_ERROR',
        error: error.message
      });
    }
  }
});