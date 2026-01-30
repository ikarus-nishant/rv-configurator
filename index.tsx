import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      primitive: any;
      sphereGeometry: any;
      meshBasicMaterial: any;
      meshStandardMaterial: any;
      boxGeometry: any;
      ambientLight: any;
      spotLight: any;
      pointLight: any;
      directionalLight: any;
      orthographicCamera: any;
      perspectiveCamera: any;
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