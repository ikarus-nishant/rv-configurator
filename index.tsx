import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Augment the global JSX namespace to include custom elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      primitive: any;
      ambientLight: any;
      spotLight: any;
      mesh: any;
      sphereGeometry: any;
      meshBasicMaterial: any;
      'model-viewer': any;
    }
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);