import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css';


const sassLevels = [
  { value: 'Subtle Chuckle', label: '😊 Subtle Chuckle' },
  { value: 'Witty Remark', label: '😏 Witty Remark' },
  { value: 'Full-Blown Sass', label: '💅 Full-Blown Sass' }
];

function Popup() {
  // Removed targetLanguage state
  const [sassLevel, setSassLevel] = useState('Witty Remark');
  const [apiKey, setApiKey] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load saved preferences
    chrome.storage.sync.get(['sassLevel', 'apiKey', 'isEnabled'], (result) => {
      if (result.sassLevel) setSassLevel(result.sassLevel);
      if (result.apiKey) setApiKey(result.apiKey);
      if (result.isEnabled !== undefined) setIsEnabled(result.isEnabled);
    });
  }, []);

  const saveSettings = () => {
    chrome.storage.sync.set({
      // No targetLanguage
      sassLevel,
      apiKey,
      isEnabled
    }, () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      // Notify background of enable/disable change
      chrome.runtime.sendMessage({ type: 'SET_ENABLED', isEnabled });
    });
  }

  return (
    <div style={{
      background: '#18181b',
      color: '#e5e7eb',
      // borderRadius: '14px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
      padding: '24px 22px 18px 22px',
      fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
      minWidth: '320px',
      maxWidth: '340px',
      border: '1.5px solid #6366f1',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <h1 style={{ fontWeight: 700, color: '#6366f1', fontSize: 22, marginBottom: 6, letterSpacing: 1 }}>✨ Sassy</h1>
        <p style={{ fontSize: 14, color: '#a1a1aa' }}>Add attitude to your text!</p>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Enable Extension</label>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => {
              setIsEnabled(e.target.checked);
              chrome.storage.sync.set({
                sassLevel,
                apiKey,
                isEnabled: e.target.checked
              }, () => {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
                chrome.runtime.sendMessage({ type: 'SET_ENABLED', isEnabled: e.target.checked });
              });
            }}
            style={{ height: 18, width: 18, accentColor: '#6366f1', borderRadius: 6, border: '1px solid #6366f1' }}
          />
          <span style={{ marginLeft: 10, fontSize: 15, color: '#a1a1aa' }}>{isEnabled ? 'Enabled' : 'Disabled'}</span>
        </div>

        {/* Target Language selection removed, always English */}

        <label style={{ display: 'block', fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Sass Level</label>
        <div style={{ marginBottom: 16 }}>
          {sassLevels.map(level => (
            <label key={level.value} style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
              <input
                type="radio"
                value={level.value}
                checked={sassLevel === level.value}
                onChange={(e) => setSassLevel(e.target.value)}
                style={{ height: 18, width: 18, accentColor: '#6366f1', marginRight: 8 }}
              />
              <span style={{ fontSize: 15, color: '#e5e7eb' }}>{level.label}</span>
            </label>
          ))}
        </div>

        <label style={{ display: 'block', fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Gemini API Key</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Gemini API key"
          style={{
            background: '#23232a',
            color: '#e5e7eb',
            border: '1px solid #6366f1',
            borderRadius: '8px',
            padding: '8px',
            fontSize: '15px',
            marginBottom: '8px',
            width: '100%',
          }}
        />
        <p style={{ fontSize: 12, color: '#a1a1aa', marginTop: 2 }}>Get your API key from Google AI Studio</p>

        <button
          onClick={saveSettings}
          style={{
            width: '100%',
            background: '#6366f1',
            color: '#fff',
            fontWeight: 600,
            fontSize: '15px',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 0',
            marginTop: '16px',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {saved ? '✅ Saved!' : 'Save Settings'}
        </button>
      </div>

      <div style={{ marginTop: 22, textAlign: 'center', fontSize: 13, color: '#a1a1aa' }}>
        <span>✨ Select text on any page and right-click to make it sassy!</span>
      </div>
    </div>
  );
}

const container = document.getElementById('popup-root');
const root = createRoot(container);
root.render(<Popup />);