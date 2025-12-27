import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Critical: Root element not found");
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Mounting Error:", error);
    rootElement.innerHTML = `
      <div style="padding: 40px; text-align: center; font-family: sans-serif;">
        <h1 style="color: #ef4444;">System Error</h1>
        <p style="color: #64748b;">The medical terminal failed to start. This might be due to a script loading error.</p>
        <button onclick="window.location.reload()" style="padding: 12px 24px; background: #0d9488; color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; margin-top: 20px;">
          Restart Terminal
        </button>
        <pre style="margin-top: 20px; background: #f1f5f9; padding: 15px; border-radius: 8px; font-size: 12px; text-align: left; overflow: auto; max-width: 100%;">
${error instanceof Error ? error.message : String(error)}
        </pre>
      </div>
    `;
  }
}