import React, { useState, useEffect } from 'react';
import Scene from './components/Scene';
import Configurator from './components/Configurator';
import ARView from './components/ARView';
import { ProductConfig, ConfigCategory } from './types';
import { INITIAL_CONFIG } from './constants';

function App() {
  const [config, setConfig] = useState<ProductConfig>(INITIAL_CONFIG);
  const [activeTab, setActiveTab] = useState<ConfigCategory>(ConfigCategory.SIZE);
  const [isARMode, setIsARMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('ar') === 'true') {
      setIsARMode(true);
    }
  }, []);

  if (isARMode) {
    return <ARView />;
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden bg-neutral-100 relative">
      {/* 3D Canvas Area - Becomes flex-1 to fill available space */}
      <div className="relative flex-1 h-[50vh] lg:h-full order-1 lg:order-1 min-w-0">
        <Scene config={config} activeTab={activeTab} />
        
        {/* Mobile-only overlay hint */}
        <div className="absolute bottom-4 left-0 w-full text-center lg:hidden pointer-events-none">
           <span className="bg-black/10 text-black/50 px-2 py-1 rounded text-xs backdrop-blur-sm">
             Drag to rotate
           </span>
        </div>
      </div>

      {/* Configuration Menu */}
      <div 
        className={`
          relative h-[50vh] lg:h-full z-20 order-2 lg:order-2 flex-none
          shadow-2xl transition-[width] duration-500 ease-in-out bg-white
          ${isSidebarOpen ? 'w-full lg:w-[25%]' : 'w-full lg:w-0'}
        `}
      >
         {/* Toggle Button (Desktop Only) - Placed to hang off the left edge */}
         <button 
           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
           className={`
             hidden lg:flex absolute top-1/2 left-0 z-50
             items-center justify-center w-6 h-12 
             bg-white border-y border-l border-neutral-200 shadow-[-4px_0_12px_rgba(0,0,0,0.05)]
             rounded-l-lg text-medium-carmine-600
             hover:bg-neutral-50 hover:text-medium-carmine-700
             transition-transform duration-500
             -translate-x-full
             cursor-pointer outline-none focus:outline-none
           `}
           title={isSidebarOpen ? "Collapse Menu" : "Expand Menu"}
         >
             <svg 
               xmlns="http://www.w3.org/2000/svg" 
               fill="none" 
               viewBox="0 0 24 24" 
               strokeWidth={2.5} 
               stroke="currentColor" 
               className={`w-4 h-4 transition-transform duration-500 ${isSidebarOpen ? 'rotate-0' : 'rotate-180'}`}
             >
               <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
             </svg>
         </button>

         {/* Inner Content Mask - Handles overflow for the content itself */}
         <div className="absolute inset-0 overflow-hidden bg-white border-l border-neutral-200">
            {/* Content Container - Fixed width to prevent squashing */}
            <div className="w-full h-full min-w-[100vw] lg:min-w-[25vw]">
              <Configurator 
                config={config} 
                setConfig={setConfig} 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
         </div>
      </div>
    </div>
  );
}

export default App;