let overlayContainer = null;

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SASS_RESULT') {
    showSassOverlay(message.originalText, message.sassyText);
  } else if (message.type === 'SASS_ERROR') {
    showErrorOverlay(message.error);
  }
});

// Move handleEscKey to global scope
function handleEscKey(event) {
  if (event.key === 'Escape') {
    removeExistingOverlay();
  }
}

function showSassOverlay(originalText, sassyText) {
  removeExistingOverlay();
  
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  // Create overlay container
  overlayContainer = document.createElement('div');
  overlayContainer.id = 'sassy-overlay';
  overlayContainer.style.cssText = `
    position: fixed;
    top: ${rect.bottom + window.scrollY + 10}px;
    left: ${rect.left + window.scrollX}px;
    z-index: 10000;
    max-width: 320px;
    background: #18181b;
    border: 1.5px solid #6366f1;
    border-radius: 14px;
    padding: 18px 20px 16px 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.45);
    font-family: 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    font-size: 15px;
    line-height: 1.5;
    color: #e5e7eb;
    backdrop-filter: blur(6px);
    transition: box-shadow 0.2s;
  `;

  overlayContainer.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <div style="font-weight: 700; color: #6366f1; font-size: 18px; letter-spacing: 1px;">✨</div>
      <button id="close-overlay" style="background: none; border: none; font-size: 22px; cursor: pointer; color: #a1a1aa; transition: color 0.2s;">×</button>
    </div>
    <div style="font-weight: 500; color: #e5e7eb; padding: 4px 0 0 0; font-size: 16px; letter-spacing: 0.2px;">${sassyText}</div>
  `;

  document.body.appendChild(overlayContainer);

  // Add close functionality
  document.getElementById('close-overlay').addEventListener('click', removeExistingOverlay);
  
  // Add ESC key listener
  document.addEventListener('keydown', handleEscKey);
}

function showErrorOverlay(error) {
  removeExistingOverlay();
  
  overlayContainer = document.createElement('div');
  overlayContainer.id = 'sassy-overlay';
  overlayContainer.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10000;
    max-width: 320px;
    background: #18181b;
    border: 1.5px solid #ef4444;
    border-radius: 14px;
    padding: 18px 20px 16px 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.45);
    font-family: 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    font-size: 15px;
    color: #e5e7eb;
    backdrop-filter: blur(6px);
    transition: box-shadow 0.2s;
  `;

  overlayContainer.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <div style="font-weight: 700; color: #ef4444; font-size: 18px; letter-spacing: 1px;">⚠️ Error</div>
      <button id="close-overlay" style="background: none; border: none; font-size: 22px; cursor: pointer; color: #a1a1aa; transition: color 0.2s;">×</button>
    </div>
    <div style="color: #e5e7eb; padding: 4px 0 0 0; font-size: 16px; letter-spacing: 0.2px;">${error}</div>
  `;

  document.body.appendChild(overlayContainer);
  document.getElementById('close-overlay').addEventListener('click', removeExistingOverlay);
  
  // Add ESC key listener
  document.addEventListener('keydown', handleEscKey);
}

function removeExistingOverlay() {
  if (overlayContainer) {
    overlayContainer.remove();
    overlayContainer = null;
    document.removeEventListener('keydown', handleEscKey);
  }
}