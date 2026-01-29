import React, { useState, useEffect } from 'react';
import { CONFIG_DATA } from '../constants';
import { ProductConfig, ConfigCategory } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface ConfiguratorProps {
  config: ProductConfig;
  setConfig: React.Dispatch<React.SetStateAction<ProductConfig>>;
  activeTab: ConfigCategory;
  setActiveTab: React.Dispatch<React.SetStateAction<ConfigCategory>>;
}

const Configurator: React.FC<ConfiguratorProps> = ({ config, setConfig, activeTab, setActiveTab }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  // Reset active section when category changes
  useEffect(() => {
    setActiveSectionIndex(0);
  }, [activeTab]);

  const calculateTotal = () => {
    let total = 0;
    CONFIG_DATA.forEach(category => {
      category.sections.forEach(section => {
        section.options.forEach(option => {
          const configValue = config[section.stateKey];
          if (Array.isArray(configValue)) {
            if (configValue.includes(option.id) && option.price) total += option.price;
          } else {
            if (configValue === option.id && option.price) total += option.price;
          }
        });
      });
    });
    return total;
  };

  const handleOptionSelect = (stateKey: keyof ProductConfig, optionId: string, multiSelect: boolean) => {
    triggerHaptic(10);
    setConfig(prev => {
      const newConfig = { ...prev };
      const currentValue = prev[stateKey];

      if (stateKey === 'size' && optionId !== prev.size) {
        newConfig.size = optionId as any;
        const floorplanCategory = CONFIG_DATA.find(c => c.id === ConfigCategory.FLOORPLAN);
        const floorplanSection = floorplanCategory?.sections.find(s => s.stateKey === 'floorplan');
        const defaultFloorplan = floorplanSection?.options.find(o => o.availableForSize?.includes(optionId))?.id;
        if (defaultFloorplan) newConfig.floorplan = defaultFloorplan;
        return newConfig;
      }

      if (multiSelect && Array.isArray(currentValue)) {
        const newArray = currentValue.includes(optionId)
          ? currentValue.filter(id => id !== optionId)
          : [...currentValue, optionId];
        (newConfig[stateKey] as string[]) = newArray;
      } else {
        if (Array.isArray(currentValue)) {
           (newConfig[stateKey] as string[]) = [optionId];
        } else {
           (newConfig[stateKey] as any) = optionId;
        }
      }
      return newConfig;
    });
  };

  const activeCategoryData = CONFIG_DATA.find(c => c.id === activeTab);
  const currentStepIndex = CONFIG_DATA.findIndex(c => c.id === activeTab);
  const isLastStep = currentStepIndex === CONFIG_DATA.length - 1;

  const handleNextStep = () => {
    triggerHaptic(12);

    // If there is a next section in the current category, go to it
    if (activeCategoryData && activeSectionIndex < activeCategoryData.sections.length - 1) {
      setActiveSectionIndex(prev => prev + 1);
      return;
    }

    if (isLastStep) {
      setIsFormOpen(true);
    } else {
      const nextCategory = CONFIG_DATA[currentStepIndex + 1];
      if (nextCategory) setActiveTab(nextCategory.id);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(20);
    setIsFormOpen(false);
    setIsSuccessOpen(true);
  };

  const getNextLabel = () => {
     // If there is a next section in the current category, use its title
     if (activeCategoryData && activeSectionIndex < activeCategoryData.sections.length - 1) {
        return `Continue to ${activeCategoryData.sections[activeSectionIndex + 1].title}`;
     }

     if (isLastStep) return "Request Quote";
     const nextCat = CONFIG_DATA[currentStepIndex + 1];
     // Simple mapping for display
     const labelMap: any = {
       [ConfigCategory.SIZE]: 'Size',
       [ConfigCategory.FLOORPLAN]: 'Floorplan',
       [ConfigCategory.EXTERIOR]: 'Exterior',
       [ConfigCategory.INTERIOR]: 'Interior',
       [ConfigCategory.SUMMARY]: 'Summary',
     };
     return `Continue to ${labelMap[nextCat.id] || 'Next'}`;
  };

  return (
    <>
      <div className="flex flex-col h-full bg-white text-neutral-900 overflow-hidden relative z-0">
        
        {/* Options Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8 space-y-4 pb-32">
          {activeTab === ConfigCategory.SUMMARY ? (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                <h3 className="text-sm font-bold text-medium-carmine-700 uppercase tracking-widest border-b border-neutral-100 pb-2 mb-4">
                    Summary
                </h3>
                {/* Summary Re-styled to match the clean aesthetic */}
                <div className="space-y-4">
                    {/* Size */}
                    <div className="flex justify-between items-center py-4 border-b border-neutral-50">
                        <div>
                            <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Model Size</div>
                            <div className="font-bold text-neutral-900">{config.size}' Floorplan</div>
                        </div>
                    </div>
                     {/* Floorplan */}
                     <div className="flex justify-between items-center py-4 border-b border-neutral-50">
                        <div>
                            <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Layout</div>
                            <div className="font-bold text-neutral-900">{config.floorplan.toUpperCase()}</div>
                        </div>
                    </div>
                     {/* Material */}
                     <div className="flex justify-between items-center py-4 border-b border-neutral-50">
                        <div>
                            <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Exterior Finish</div>
                            <div className="font-bold text-neutral-900 capitalize">{config.material.replace('_', ' ')}</div>
                        </div>
                    </div>
                </div>
            </div>
          ) : (
            activeCategoryData?.sections.map((section, index) => {
              const isActiveSection = index === activeSectionIndex;
              return (
                <div 
                  key={index} 
                  className={`
                    animate-[slideIn_0.3s_ease-out] border transition-colors duration-300
                    ${isActiveSection 
                      ? 'bg-neutral-50 border-neutral-200' 
                      : 'bg-white border-transparent'
                    }
                  `}
                >
                   <button
                     onClick={() => {
                        triggerHaptic(5);
                        setActiveSectionIndex(index);
                     }}
                     className="w-full flex items-center justify-between p-4 outline-none text-left"
                   >
                     <h3 className={`text-sm font-bold uppercase tracking-widest transition-colors ${isActiveSection ? 'text-medium-carmine-700' : 'text-neutral-500 hover:text-neutral-700'}`}>
                        {section.title || `Option Group ${index + 1}`}
                     </h3>
                     <div className={`text-neutral-400 transition-transform duration-300 ${isActiveSection ? 'rotate-180' : 'rotate-0'}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                     </div>
                   </button>
                   
                   <div className={`
                      overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out
                      ${isActiveSection ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}
                   `}>
                     <div className="p-4 pt-0 flex flex-col gap-4">
                      {section.options.map((option) => {
                        if (option.availableForSize && !option.availableForSize.includes(config.size)) return null;
                        const configValue = config[section.stateKey];
                        const isSelected = Array.isArray(configValue) ? configValue.includes(option.id) : configValue === option.id;
                        
                        return (
                          <button
                            key={option.id}
                            onClick={() => handleOptionSelect(section.stateKey, option.id, section.multiSelect)}
                            className={`
                              group relative flex flex-row items-stretch text-left transition-all duration-200 w-full p-4
                              border-2 active:scale-[0.99] outline-none
                              ${isSelected 
                                ? 'border-medium-carmine-600 shadow-md bg-medium-carmine-50' 
                                : 'border-neutral-200 hover:border-neutral-300 bg-white'
                              }
                            `}
                          >
                            {/* Image / Swatch - Left Side */}
                            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-neutral-100 flex-shrink-0 mr-5 relative overflow-hidden border border-neutral-100">
                               {option.icon ? (
                                 <img src={option.icon} alt={option.label} className="w-full h-full object-cover mix-blend-multiply" />
                               ) : (
                                 <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-300">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect width="24" height="24" /></svg>
                                 </div>
                               )}
                            </div>

                            {/* Content - Right Side */}
                            <div className="flex-1 flex flex-col justify-between min-h-[5rem] lg:min-h-[6rem]">
                              <div>
                                <span className="block font-bold text-lg text-neutral-900 leading-tight mb-1">
                                  {option.label}
                                </span>
                                {option.description && (
                                  <p className="text-xs text-neutral-500 leading-relaxed font-medium line-clamp-2 lg:line-clamp-3">
                                    {option.description}
                                  </p>
                                )}
                              </div>
                              
                              <div className="text-right mt-2">
                                 <span className="font-bold text-neutral-900 text-sm tracking-tight">
                                    {option.price === 0 ? '$0.00' : `$${option.price?.toLocaleString('en-US', {minimumFractionDigits: 2})}`}
                                 </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                     </div>
                   </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary - Matches Image Design */}
        <div className="absolute bottom-0 left-0 w-full bg-white border-t border-neutral-200 p-6 lg:px-8 lg:py-6 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex items-end justify-between gap-4">
              <div className="flex flex-col">
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-1">Estimated Price</p>
                <div className="text-3xl font-medium text-neutral-900 tracking-tight leading-none">
                    ${calculateTotal().toLocaleString('en-US', {minimumFractionDigits: 2})}
                </div>
              </div>
              
              <button 
                  onClick={handleNextStep} 
                  className="
                    bg-medium-carmine-700 hover:bg-medium-carmine-800 text-white 
                    text-xs font-bold uppercase tracking-[0.15em] 
                    py-4 px-6 lg:px-10
                    transition-all shadow-lg shadow-medium-carmine-900/10 active:scale-[0.98] 
                    whitespace-nowrap
                  "
                >
                  {getNextLabel()}
                </button>
            </div>
        </div>
      </div>

      {/* Modals */}
      {(isFormOpen || isSuccessOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm transition-all">
          {isFormOpen && (
            <div className="bg-white w-full max-w-md p-8 lg:p-12 shadow-2xl relative animate-[scaleIn_0.2s_ease-out]">
              <button onClick={() => { triggerHaptic(); setIsFormOpen(false); }} className="absolute top-6 right-6 p-2 hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h2 className="text-2xl font-bold uppercase tracking-wide mb-2 text-neutral-900">Reserve Build</h2>
              <p className="text-xs text-neutral-500 mb-8 uppercase tracking-widest font-bold">Connect with a specialist</p>
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Full Name</label>
                  <input required type="text" className="w-full p-4 bg-neutral-50 border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-medium-carmine-600/20 focus:border-medium-carmine-600 transition-all placeholder:text-neutral-300" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Email Address</label>
                  <input required type="email" className="w-full p-4 bg-neutral-50 border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-medium-carmine-600/20 focus:border-medium-carmine-600 transition-all placeholder:text-neutral-300" placeholder="john@example.com" />
                </div>
                <button type="submit" className="w-full py-5 bg-medium-carmine-600 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-medium-carmine-700 transition-all mt-4 shadow-lg shadow-medium-carmine-200 active:scale-[0.98]">
                  Submit Reservation
                </button>
              </form>
            </div>
          )}
          {isSuccessOpen && (
            <div className="bg-white w-full max-w-sm p-10 lg:p-14 shadow-2xl text-center relative animate-[scaleIn_0.2s_ease-out]">
              <div className="w-20 h-20 bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-8 shadow-inner border border-green-100">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-2xl font-bold uppercase tracking-wide mb-4 text-neutral-900">Inquiry Sent</h2>
              <p className="text-sm text-neutral-500 mb-10 leading-relaxed font-medium">Your configuration is secured. A concierge will contact you shortly.</p>
              <button onClick={() => { triggerHaptic(); setIsSuccessOpen(false); }} className="w-full py-4 border border-neutral-200 text-neutral-900 text-xs font-bold uppercase tracking-[0.15em] hover:bg-neutral-50 transition-all active:scale-[0.98]">
                Return to Configurator
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Configurator;