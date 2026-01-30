import React, { useState, useEffect, useRef } from 'react';
import Scene from './components/Scene';
import Configurator from './components/Configurator';
import ARView from './components/ARView';
import { ProductConfig, ConfigCategory } from './types';
import { INITIAL_CONFIG, CONFIG_DATA } from './constants';
import { triggerHaptic } from './utils/haptics';

function App() {
  const [config, setConfig] = useState<ProductConfig>(INITIAL_CONFIG);
  const [activeTab, setActiveTab] = useState<ConfigCategory>(ConfigCategory.SIZE);
  const [isARMode, setIsARMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('ar') === 'true') {
      setIsARMode(true);
    }
  }, []);

  // Auto-scroll the active tab into view when it changes
  useEffect(() => {
    if (navContainerRef.current) {
        const activeElement = navContainerRef.current.querySelector('[data-active="true"]');
        if (activeElement) {
            activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }
  }, [activeTab]);

  const handleTabClick = (id: ConfigCategory) => {
    triggerHaptic(8);
    setActiveTab(id);
  };

  const handleSidebarToggle = () => {
    triggerHaptic(5);
    setIsSidebarOpen(!isSidebarOpen);
  };

  const currentStepIndex = CONFIG_DATA.findIndex(c => c.id === activeTab);
  
  const handleNextStep = () => {
    if (currentStepIndex < CONFIG_DATA.length - 1) {
        handleTabClick(CONFIG_DATA[currentStepIndex + 1].id);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
        handleTabClick(CONFIG_DATA[currentStepIndex - 1].id);
    }
  };

  if (isARMode) {
    return <ARView config={config} onExit={() => { triggerHaptic(); setIsARMode(false); }} />;
  }

  const stepLabels: Record<string, string> = {
    [ConfigCategory.SIZE]: 'Size',
    [ConfigCategory.FLOORPLAN]: 'Floorplan',
    [ConfigCategory.EXTERIOR]: 'Exterior',
    [ConfigCategory.INTERIOR]: 'Interior',
    [ConfigCategory.SUMMARY]: 'Summary'
  };

  return (
    <div className="flex flex-col h-[100dvh] w-screen overflow-hidden bg-neutral-100 font-sans">
      <header className="flex-none h-20 lg:h-24 bg-[#111111] text-white flex items-center justify-between px-2 lg:px-8 z-30 shadow-2xl border-b border-white/5 relative overflow-hidden">
         
         {/* Mobile Nav Prev Button */}
         <button 
           onClick={handlePrevStep}
           disabled={currentStepIndex === 0}
           className={`lg:hidden flex items-center justify-center w-12 h-full text-white transition-opacity ${currentStepIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 active:scale-90'}`}
         >
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
           </svg>
         </button>

         {/* Navigation - Scrollable Area */}
         <div className="flex-1 flex items-center justify-start lg:justify-center overflow-x-auto no-scrollbar mask-linear-fade h-full mx-2" ref={navContainerRef}>
            <div className="flex items-center gap-6 lg:gap-10 px-4 min-w-max mx-auto h-full">
            {CONFIG_DATA.map((category, index) => {
               const isActive = activeTab === category.id;
               const isCompleted = index < currentStepIndex;
               
               return (
                  <div 
                    key={category.id} 
                    data-active={isActive}
                    className="flex items-center group cursor-pointer" 
                    onClick={() => handleTabClick(category.id)}
                  >
                     {index > 0 && (
                       <div className={`hidden sm:block w-4 lg:w-8 xl:w-16 h-[1px] mx-2 lg:mx-4 transition-colors duration-500 ${isCompleted || isActive ? 'bg-neutral-600' : 'bg-neutral-800'}`} />
                     )}
                     <div className="flex items-center gap-3 relative">
                       <div className={`
                          flex items-center justify-center w-6 h-6 lg:w-9 lg:h-9 rounded-full text-[10px] lg:text-[11px] font-bold transition-all duration-500 border z-10 shrink-0
                          ${isActive ? 'bg-medium-carmine-600 border-medium-carmine-600 text-white shadow-[0_0_20px_rgba(186,59,50,0.5)] scale-110' : ''}
                          ${isCompleted ? 'bg-neutral-800 border-neutral-600 text-neutral-400' : ''}
                          ${!isActive && !isCompleted ? 'bg-transparent border-neutral-800 text-neutral-700' : ''}
                       `}>
                          {isCompleted ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 lg:w-4 lg:h-4">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            index + 1
                          )}
                       </div>
                       {/* Labels Typography Update: Overpass Medium 14px */}
                       <span className={`text-[14px] font-medium font-overpass uppercase tracking-widest transition-all duration-300 ${isActive ? 'text-white translate-y-0 opacity-100' : 'text-neutral-500 group-hover:text-neutral-400'}`}>
                          {stepLabels[category.id] || category.id}
                       </span>
                     </div>
                  </div>
               )
            })}
            </div>
         </div>

         {/* Mobile Nav Next Button */}
         <button 
           onClick={handleNextStep}
           disabled={currentStepIndex === CONFIG_DATA.length - 1}
           className={`lg:hidden flex items-center justify-center w-12 h-full text-white transition-opacity ${currentStepIndex === CONFIG_DATA.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 active:scale-90'}`}
         >
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
             <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
           </svg>
         </button>

      </header>

      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden w-full">
        <div className={`relative w-full lg:flex-1 transition-[height] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] order-1 lg:order-1 min-w-0 bg-[#f0f0f0] ${isSidebarOpen ? 'h-[45%] lg:h-full' : 'h-full lg:h-full'}`}>
          <Scene 
            config={config} 
            activeTab={activeTab} 
            onEnterAR={() => { triggerHaptic(15); setIsARMode(true); }} 
          />
        </div>

        <div 
          className={`
            relative z-20 order-2 lg:order-2 flex-none
            shadow-2xl transition-[width,height] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] bg-white
            ${isSidebarOpen ? 'h-[55%] w-full lg:h-full lg:w-[28%]' : 'h-0 w-full lg:h-full lg:w-0'}
          `}
        >
           {/* Desktop Toggle Button */}
           <button 
             onClick={handleSidebarToggle}
             className={`
               hidden lg:flex absolute top-1/2 left-0 z-50
               items-center justify-center w-8 h-16 
               bg-white border-y border-l border-neutral-200 shadow-[-8px_0_20px_rgba(0,0,0,0.05)]
               rounded-none text-medium-carmine-600
               hover:bg-neutral-50 hover:text-medium-carmine-700 hover:pb-1
               transition-all duration-300
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
                 className={`w-5 h-5 transition-transform duration-500 ${isSidebarOpen ? 'rotate-0' : 'rotate-180'}`}
               >
                 <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
               </svg>
           </button>

           {/* Mobile Toggle Button */}
           <button 
             onClick={handleSidebarToggle}
             className={`
               lg:hidden flex absolute top-0 left-1/2 z-50
               items-center justify-center w-16 h-8 
               bg-white border-x border-t border-neutral-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]
               rounded-none text-medium-carmine-600
               hover:bg-neutral-50 hover:text-medium-carmine-700 hover:pb-1
               transition-all duration-300
               -translate-x-1/2 -translate-y-full
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
                 className={`w-5 h-5 transition-transform duration-500 ${isSidebarOpen ? 'rotate-90' : '-rotate-90'}`}
               >
                 <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
               </svg>
           </button>

           <div className="absolute inset-0 overflow-hidden bg-white lg:border-l border-neutral-100">
              <div className="w-full h-full">
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