import React, { useRef } from 'react';
import { ProductConfig } from '../types';
import { triggerHaptic } from '../utils/haptics';

// Augment the global JSX namespace to include custom elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
      [elemName: string]: any;
    }
  }
}

interface ARViewProps {
  config?: ProductConfig;
  onExit?: () => void;
}

const AR_MODELS: Record<string, string> = {
  aluminum: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/3d-assets/ar-alu.glb',
  red: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/3d-assets/ar-red.glb',
  teal: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/3d-assets/ar-teal.glb'
};

const ARView: React.FC<ARViewProps> = ({ config, onExit }) => {
  const modelViewerRef = useRef<any>(null);

  // Determine material ID from config or URL params
  const params = new URLSearchParams(window.location.search);
  const materialId = config?.material || params.get('material') || 'aluminum';
  
  // Select correct model URL
  const modelSrc = AR_MODELS[materialId] || AR_MODELS['aluminum'];

  const handleClose = (e: React.MouseEvent) => {
    triggerHaptic();
    if (onExit) {
      e.preventDefault();
      onExit();
    }
  };

  return (
    <div className="w-full h-screen bg-neutral-100 relative flex flex-col items-center justify-center">
      {/* Back Button */}
      <a 
        href={window.location.pathname} 
        onClick={handleClose}
        className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-md p-3 rounded-none shadow-xl border border-neutral-200 text-neutral-900 hover:scale-105 active:scale-95 transition-all"
        aria-label="Exit AR"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </a>

      {/* Header Badge */}
      <div className="absolute top-6 w-full text-center z-10 pointer-events-none">
        <span className="text-[10px] font-bold px-5 py-2 bg-neutral-900/90 backdrop-blur rounded-none text-white uppercase tracking-widest border border-neutral-700/50 shadow-lg">
            AR Experience
        </span>
      </div>

      <model-viewer
        ref={modelViewerRef}
        src={modelSrc}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        tone-mapping="neutral"
        shadow-intensity="1"
        style={{ width: '100%', height: '100%' }}
      >
        <button 
            slot="ar-button" 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-14 h-14 bg-medium-carmine-600 rounded-none shadow-lg shadow-medium-carmine-600/40 flex items-center justify-center text-white active:scale-95 transition-transform"
            aria-label="View in Space"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
        </button>
      </model-viewer>
    </div>
  );
};

export default ARView;