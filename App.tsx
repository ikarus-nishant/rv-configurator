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
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden bg-neutral-100">
      {/* 3D Canvas Area (75% on desktop, 50% on mobile) */}
      <div className="w-full h-[50vh] lg:h-full lg:w-[75%] order-1 lg:order-1 relative">
        <Scene config={config} activeTab={activeTab} />
        
        {/* Mobile-only overlay hint */}
        <div className="absolute bottom-4 left-0 w-full text-center lg:hidden pointer-events-none">
           <span className="bg-black/10 text-black/50 px-2 py-1 rounded text-xs backdrop-blur-sm">
             Drag to rotate
           </span>
        </div>
      </div>

      {/* Configuration Menu (25% on desktop, 50% on mobile) */}
      <div className="w-full h-[50vh] lg:h-full lg:w-[25%] order-2 lg:order-2 relative z-10">
        <Configurator 
          config={config} 
          setConfig={setConfig} 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
}

export default App;