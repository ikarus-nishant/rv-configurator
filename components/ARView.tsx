import React, { useEffect, useRef } from 'react';
import { CONFIG_DATA } from '../constants';
import { ConfigCategory, ProductConfig } from '../types';
import { triggerHaptic } from '../utils/haptics';

// Augment the global JSX namespace to include custom elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

interface ARViewProps {
  config?: ProductConfig;
  onExit?: () => void;
}

const ARView: React.FC<ARViewProps> = ({ config, onExit }) => {
  const modelViewerRef = useRef<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Use prop config if available, fallback to URL params
    const materialId = config?.material || params.get('material');

    const handleLoad = () => {
      const modelViewer = modelViewerRef.current;
      if (!modelViewer || !modelViewer.model) return;

      // Apply Material Configuration
      if (materialId) {
        // Find material data in new structure
        const materialSection = CONFIG_DATA.find(c => c.id === ConfigCategory.EXTERIOR)
          ?.sections.find(s => s.stateKey === 'material');
        const materialData = materialSection?.options.find(o => o.id === materialId);
        
        if (materialData?.colorCode) {
          const material = modelViewer.model.materials.find((m: any) => m.name === 'Steel');
          if (material) {
             // Convert hex to RGB array [r, g, b, alpha]
             const hex = materialData.colorCode.replace('#', '');
             const r = parseInt(hex.substring(0, 2), 16) / 255;
             const g = parseInt(hex.substring(2, 4), 16) / 255;
             const b = parseInt(hex.substring(4, 6), 16) / 255;
             
             material.pbrMetallicRoughness.setBaseColorFactor([r, g, b, 1.0]);

             // Adjust roughness/metalness based on type
             if (materialId === 'matte_black') {
                material.pbrMetallicRoughness.setRoughnessFactor(0.9);
                material.pbrMetallicRoughness.setMetallicFactor(0.1);
             } else if (materialId === 'aluminum') {
                material.pbrMetallicRoughness.setRoughnessFactor(0.3);
                material.pbrMetallicRoughness.setMetallicFactor(1.0);
             }
          }
        }
      }
    };

    const mv = modelViewerRef.current;
    if (mv) {
      mv.addEventListener('load', handleLoad);
    }

    return () => {
      if (mv) {
        mv.removeEventListener('load', handleLoad);
      }
    };
  }, [config]);

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
        src="https://dl.dropbox.com/scl/fi/n893bek5wluovtcl5qtpj/ext.glb?rlkey=9n026wssl8o6kf6sp4iix4lfd&dl=1"
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