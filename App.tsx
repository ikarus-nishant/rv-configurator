import React, { useState, useEffect } from 'react';
import Scene from './components/Scene';
import Configurator from './components/Configurator';
import ARView from './components/ARView';
import { ProductConfig, ConfigCategory } from './types';
import { INITIAL_CONFIG, CONFIG_DATA } from './constants';

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

  const currentStepIndex = CONFIG_DATA.findIndex(c => c.id === activeTab);

  // Mapping for cleaner labels in the top bar
  const stepLabels: Record<string, string> = {
    [ConfigCategory.SIZE]: 'Size',
    [ConfigCategory.FLOORPLAN]: 'Floorplan',
    [ConfigCategory.EXTERIOR]: 'Exterior',
    [ConfigCategory.INTERIOR]: 'Interior',
    [ConfigCategory.SUMMARY]: 'Summary'
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-neutral-100 font-sans">
      {/* Global Navigation Bar */}
      <header className="flex-none h-20 bg-[#111111] text-white flex items-center justify-center px-4 lg:px-8 z-30 shadow-md border-b border-white/5 relative">
         
         {/* Logo - Positioned Absolute Left */}
         <div className="absolute left-4 lg:left-8 flex items-center gap-3 top-1/2 -translate-y-1/2">
             <img 
              src="https://cdn.prod.website-files.com/65792fa13a1bbf4d8e520e33/65ddb66c43de033385b8502b_Delta-new-logo%20(1).avif" 
              alt="Delta Logo" 
              className="h-8 w-auto brightness-0 invert object-contain opacity-90 hover:opacity-100 transition-opacity"
            />
         </div>

         {/* Desktop Steps Navigation - Centered via Flex parent */}
         <div className="hidden lg:flex items-center gap-8">
            {CONFIG_DATA.map((category, index) => {
               const isActive = activeTab === category.id;
               const isCompleted = index < currentStepIndex;
               
               return (
                  <div key={category.id} className="flex items-center group cursor-pointer" onClick={() => setActiveTab(category.id)}>
                     {/* Divider Line */}
                     {index > 0 && (
                       <div className={`w-12 h-[1px] mx-4 ${isCompleted || isActive ? 'bg-neutral-600' : 'bg-neutral-800'}`} />
                     )}
                     
                     <div className="flex items-center gap-3">
                       <div className={`
                          flex items-center justify-center w-8 h-8 rounded-full text-[10px] font-bold transition-all duration-300 border
                          ${isActive ? 'bg-medium-carmine-600 border-medium-carmine-600 text-white shadow-[0_0_15px_rgba(186,59,50,0.4)]' : ''}
                          ${isCompleted ? 'bg-transparent border-neutral-500 text-neutral-400' : ''}
                          ${!isActive && !isCompleted ? 'bg-transparent border-neutral-800 text-neutral-600' : ''}
                       `}>
                          {isCompleted ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            index + 1
                          )}
                       </div>
                       <span className={`text-xs font-medium uppercase tracking-widest transition-colors ${isActive || isCompleted ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'}`}>
                          {stepLabels[category.id] || category.id}
                       </span>
                     </div>
                  </div>
               )
            })}
         </div>

         {/* Mobile Step Indicator - Centered */}
         <div className="lg:hidden flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 bg-neutral-800 rounded text-neutral-300 uppercase tracking-widest border border-neutral-700">
               Step {currentStepIndex + 1}/{CONFIG_DATA.length}
            </span>
         </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden w-full">
        {/* 3D Canvas Area */}
        <div className="relative w-full lg:flex-1 h-1/2 lg:h-full order-1 lg:order-1 min-w-0 bg-[#f0f0f0]">
          <Scene config={config} activeTab={activeTab} />
          
          {/* Mobile-only overlay hint */}
          <div className="absolute bottom-4 left-0 w-full text-center lg:hidden pointer-events-none z-10">
             <span className="bg-black/10 text-black/50 px-3 py-1 rounded text-xs backdrop-blur-sm uppercase tracking-widest font-medium">
               Drag to rotate
             </span>
          </div>
        </div>

        {/* Configuration Menu */}
        <div 
          className={`
            relative h-1/2 lg:h-full z-20 order-2 lg:order-2 flex-none
            shadow-2xl transition-[width] duration-500 ease-in-out bg-white
            ${isSidebarOpen ? 'w-full lg:w-[25%]' : 'w-full lg:w-0'}
          `}
        >
           {/* Toggle Button (Desktop Only) */}
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

           {/* Inner Content Mask */}
           <div className="absolute inset-0 overflow-hidden bg-white border-l border-neutral-200">
              {/* Content Container */}
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
    </div>
  );
}

export default App;