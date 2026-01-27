import React, { useEffect, useRef } from 'react';
import { CONFIG_DATA } from '../constants';
import { ConfigCategory } from '../types';

// Declare intrinsic elements to avoid TypeScript errors with custom web components and missing standard types
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'camera-controls'?: boolean;
        'tone-mapping'?: string;
        'shadow-intensity'?: string;
        [key: string]: any;
      };
      // Catch-all for other elements (div, span, group, primitive, etc.) to prevent TS errors
      [elemName: string]: any;
    }
  }
}

const ARView: React.FC = () => {
  const modelViewerRef = useRef<any>(null);

  useEffect(() => {
    // Parse configuration from URL parameters
    const params = new URLSearchParams(window.location.search);
    const materialId = params.get('material');
    // const exteriorIds = params.get('exterior')?.split(',') || []; // Visibility logic is complex in model-viewer without variants, focusing on material.

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
  }, []);

  return (
    <div className="w-full h-screen bg-white relative flex flex-col items-center justify-center">
      {/* Back Button */}
      <a 
        href={window.location.pathname} 
        className="absolute top-4 left-4 z-20 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg border border-neutral-200 text-neutral-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </a>

      <div className="absolute top-4 w-full text-center z-10 pointer-events-none">
        <h1 className="text-sm font-semibold text-neutral-900 bg-white/90 inline-block px-4 py-1 rounded-full shadow-sm backdrop-blur">
            AR Mode
        </h1>
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
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-medium-carmine-600 text-white px-6 py-3 rounded-full font-medium text-sm shadow-lg border-none outline-none whitespace-nowrap"
        >
            👋 Tap to Place in Room
        </button>
      </model-viewer>
    </div>
  );
};

export default ARView;