import React, { useState, useRef } from 'react';
import { CONFIG_DATA } from '../constants';
import { ProductConfig, ConfigCategory } from '../types';

interface ConfiguratorProps {
  config: ProductConfig;
  setConfig: React.Dispatch<React.SetStateAction<ProductConfig>>;
  activeTab: ConfigCategory;
  setActiveTab: React.Dispatch<React.SetStateAction<ConfigCategory>>;
}

const Configurator: React.FC<ConfiguratorProps> = ({ config, setConfig, activeTab, setActiveTab }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // Scroll handler for tabs
  const scrollTabs = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 150;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount 
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Total Price Calculation
  const calculateTotal = () => {
    let total = 0;
    
    CONFIG_DATA.forEach(category => {
      category.sections.forEach(section => {
        section.options.forEach(option => {
          const configValue = config[section.stateKey];
          
          if (Array.isArray(configValue)) {
            // Multi-select (Add-ons, etc)
            if (configValue.includes(option.id) && option.price) {
              total += option.price;
            }
          } else {
            // Single select (Size, Material, etc)
            if (configValue === option.id && option.price) {
              total += option.price;
            }
          }
        });
      });
    });

    return total;
  };

  const handleOptionSelect = (stateKey: keyof ProductConfig, optionId: string, multiSelect: boolean) => {
    setConfig(prev => {
      const newConfig = { ...prev };
      const currentValue = prev[stateKey];

      // Handle Size Change specifically to reset Floorplan
      if (stateKey === 'size' && optionId !== prev.size) {
        newConfig.size = optionId as any;
        
        const floorplanCategory = CONFIG_DATA.find(c => c.id === ConfigCategory.FLOORPLAN);
        const floorplanSection = floorplanCategory?.sections.find(s => s.stateKey === 'floorplan');
        const defaultFloorplan = floorplanSection?.options.find(o => o.availableForSize?.includes(optionId))?.id;
        
        if (defaultFloorplan) {
          newConfig.floorplan = defaultFloorplan;
        }
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
  
  // Navigation Logic
  const currentStepIndex = CONFIG_DATA.findIndex(c => c.id === activeTab);
  const isLastStep = currentStepIndex === CONFIG_DATA.length - 1;

  const scrollToTab = (index: number) => {
    if (scrollContainerRef.current) {
        const width = scrollContainerRef.current.scrollWidth;
        const itemWidth = width / CONFIG_DATA.length;
        scrollContainerRef.current.scrollTo({
            left: index * itemWidth,
            behavior: 'smooth'
        });
    }
  };

  const handleNextStep = () => {
    if (isLastStep) {
      setIsFormOpen(true);
    } else {
      const nextCategory = CONFIG_DATA[currentStepIndex + 1];
      if (nextCategory) {
        setActiveTab(nextCategory.id);
        scrollToTab(currentStepIndex + 1);
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      const prevCategory = CONFIG_DATA[currentStepIndex - 1];
      if (prevCategory) {
        setActiveTab(prevCategory.id);
        scrollToTab(currentStepIndex - 1);
      }
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormOpen(false);
    setIsSuccessOpen(true);
  };

  const getSelectedOptionDetails = (stateKey: keyof ProductConfig) => {
    const value = config[stateKey];
    let foundOptions: { label: string, price: number }[] = [];

    CONFIG_DATA.forEach(cat => {
      cat.sections.forEach(sec => {
        if (sec.stateKey === stateKey) {
          sec.options.forEach(opt => {
            if (Array.isArray(value)) {
              if (value.includes(opt.id)) foundOptions.push({ label: opt.label, price: opt.price || 0 });
            } else {
              if (value === opt.id) foundOptions.push({ label: opt.label, price: opt.price || 0 });
            }
          });
        }
      });
    });
    return foundOptions;
  };

  return (
    <>
      <div className="flex flex-col h-full bg-white text-neutral-900 overflow-hidden relative z-0">
        
        {/* Mobile Tabs */}
        <div className="flex lg:hidden items-center border-b border-neutral-100 bg-white relative flex-none">
          <button 
            onClick={() => scrollTabs('left')}
            className="p-3 text-neutral-400 hover:text-medium-carmine-600 transition-colors z-10 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap flex-1"
          >
            {CONFIG_DATA.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors duration-200 relative shrink-0
                  ${activeTab === cat.id ? 'text-medium-carmine-700' : 'text-neutral-400'}
                `}
              >
                {cat.id}
                {activeTab === cat.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-medium-carmine-600" />
                )}
              </button>
            ))}
          </div>

          <button 
            onClick={() => scrollTabs('right')}
            className="p-3 text-neutral-400 hover:text-medium-carmine-600 transition-colors z-10 focus:outline-none"
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* Options Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 space-y-6 lg:space-y-8">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 lg:hidden text-neutral-400">{activeTab} View</h2>
          
          {activeTab === ConfigCategory.SUMMARY ? (
            <div className="space-y-6 lg:space-y-8 animate-[fadeIn_0.3s_ease-out]">
              <div>
                <h3 className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-4 pb-2 border-b border-neutral-100">Configuration Details</h3>
                
                <div className="space-y-4">
                   <div className="flex justify-between items-start">
                      <div>
                         <span className="block text-[10px] font-bold text-neutral-900 uppercase tracking-wider mb-0.5">Model</span>
                         <span className="text-sm text-neutral-600">{getSelectedOptionDetails('size')[0]?.label}</span>
                      </div>
                      <span className="text-sm font-medium text-neutral-900">${getSelectedOptionDetails('size')[0]?.price.toLocaleString()}</span>
                   </div>

                   <div className="flex justify-between items-start">
                      <div>
                         <span className="block text-[10px] font-bold text-neutral-900 uppercase tracking-wider mb-0.5">Floorplan</span>
                         <span className="text-sm text-neutral-600">{getSelectedOptionDetails('floorplan')[0]?.label}</span>
                      </div>
                      <span className="text-sm font-medium text-neutral-900">
                         {getSelectedOptionDetails('floorplan')[0]?.price === 0 ? 'Included' : `+$${getSelectedOptionDetails('floorplan')[0]?.price.toLocaleString()}`}
                      </span>
                   </div>

                   <div className="flex justify-between items-start">
                      <div>
                         <span className="block text-[10px] font-bold text-neutral-900 uppercase tracking-wider mb-0.5">Shell Finish</span>
                         <span className="text-sm text-neutral-600">{getSelectedOptionDetails('material')[0]?.label}</span>
                      </div>
                      <span className="text-sm font-medium text-neutral-900">
                        {getSelectedOptionDetails('material')[0]?.price === 0 ? 'Included' : `+$${getSelectedOptionDetails('material')[0]?.price.toLocaleString()}`}
                      </span>
                   </div>

                   {getSelectedOptionDetails('exterior').length > 0 && (
                      <div className="pt-2">
                        <span className="block text-[10px] font-bold text-neutral-900 uppercase tracking-wider mb-2">Selected Add-ons</span>
                        <div className="space-y-2">
                           {getSelectedOptionDetails('exterior').map((opt, i) => (
                              <div key={i} className="flex justify-between items-start pl-2 border-l-2 border-neutral-100">
                                <span className="text-sm text-neutral-600">{opt.label}</span>
                                <span className="text-sm font-medium text-neutral-900">+${opt.price.toLocaleString()}</span>
                              </div>
                           ))}
                        </div>
                      </div>
                   )}
                </div>
              </div>
            </div>
          ) : (
            activeCategoryData?.sections.map((section, index) => (
              <div key={index} className="space-y-3">
                 {section.title && (
                   <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">{section.title}</h3>
                 )}
                 
                 <div className="grid grid-cols-1 gap-2.5">
                  {section.options.map((option) => {
                    if (option.availableForSize && !option.availableForSize.includes(config.size)) {
                        return null;
                    }

                    const configValue = config[section.stateKey];
                    const isSelected = Array.isArray(configValue) 
                       ? configValue.includes(option.id)
                       : configValue === option.id;

                    return (
                      <button
                        key={option.id}
                        onClick={() => handleOptionSelect(section.stateKey, option.id, section.multiSelect)}
                        className={`group flex items-start p-3.5 lg:p-4 border rounded-xl text-left transition-all duration-300 w-full
                          ${isSelected ? 'border-medium-carmine-600 bg-medium-carmine-50/30 ring-1 ring-medium-carmine-600' : 'border-neutral-100 hover:border-neutral-300'}
                        `}
                      >
                        {option.icon ? (
                          <div className="w-24 lg:w-32 h-16 lg:h-20 rounded-lg overflow-hidden border border-neutral-200 flex-shrink-0 mr-4 bg-white">
                             <img src={option.icon} alt={option.label} className="w-full h-full object-contain p-1" />
                          </div>
                        ) : option.colorCode ? (
                           <div 
                              className="w-8 h-8 rounded-full border border-neutral-200 shadow-sm flex-shrink-0 mr-4" 
                              style={{ backgroundColor: option.colorCode }}
                           />
                        ) : null}

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div className="font-bold text-[10px] lg:text-xs text-neutral-900 uppercase tracking-widest leading-tight">{option.label}</div>
                            {option.price !== undefined && (
                              <div className="text-[10px] lg:text-xs font-bold text-neutral-900 whitespace-nowrap uppercase tracking-widest">
                                {option.price === 0 ? 'INCL.' : `+$${option.price.toLocaleString()}`}
                              </div>
                            )}
                          </div>
                          
                          {option.description && (
                            <div className="text-[10px] lg:text-xs text-neutral-500 mt-2 leading-relaxed line-clamp-2">
                              {option.description}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                 </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary - Always Visible */}
        <div className="border-t border-neutral-100 bg-white flex-none">
          
          {/* Mobile Footer: Arrow Navigation with Center Price */}
          <div className="lg:hidden p-4 flex items-center justify-between gap-4">
            <button 
              onClick={handlePreviousStep}
              disabled={currentStepIndex === 0}
              className={`p-3 rounded-full border border-neutral-200 text-neutral-900 transition-all active:scale-95
                ${currentStepIndex === 0 ? 'opacity-30 cursor-not-allowed border-transparent bg-neutral-50' : 'hover:bg-neutral-50 bg-white shadow-sm'}
              `}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">MSRP</span>
              <span className="text-xl font-light text-neutral-900 tracking-tight">${calculateTotal().toLocaleString()}</span>
            </div>

            <button 
              onClick={handleNextStep}
              className={`p-3 rounded-full transition-all shadow-lg active:scale-95 flex items-center justify-center
                ${isLastStep ? 'bg-medium-carmine-600 text-white' : 'bg-white border border-neutral-200 text-neutral-900 hover:bg-neutral-50'}
              `}
            >
               {isLastStep ? (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                 </svg>
               ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                 </svg>
               )}
            </button>
          </div>

          {/* Desktop Footer: Standard Layout */}
          <div className="hidden lg:block p-8">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-1">Build Summary</p>
                <div className="text-3xl font-light text-neutral-900 tracking-tight">${calculateTotal().toLocaleString()}</div>
              </div>
              <div className="text-[10px] text-neutral-400 font-medium uppercase tracking-widest mb-1.5">MSRP</div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={handlePreviousStep}
                disabled={currentStepIndex === 0}
                className={`flex-1 py-4 border border-neutral-200 text-neutral-900 text-xs font-bold uppercase tracking-widest transition-all
                  ${currentStepIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-neutral-50 active:scale-95'}
                `}
              >
                Back
              </button>
              
              <button 
                onClick={handleNextStep}
                className="flex-[2] py-4 bg-medium-carmine-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-medium-carmine-700 transition-all shadow-xl shadow-medium-carmine-200 active:scale-[0.98]"
              >
                {isLastStep ? 'Request Quote' : 'Next Stage'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals - Responsive Scaling */}
      {(isFormOpen || isSuccessOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          {isFormOpen && (
            <div className="bg-white w-full max-w-md p-6 lg:p-10 rounded-2xl shadow-2xl relative animate-[fadeIn_0.3s_ease-out]">
              <button onClick={() => setIsFormOpen(false)} className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <h2 className="text-lg lg:text-xl font-bold uppercase tracking-widest mb-2 text-neutral-900">Reserve Your Build</h2>
              <p className="text-[10px] lg:text-xs text-neutral-500 mb-8 uppercase tracking-widest font-medium">Connect with an authorized specialist</p>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Full Name</label>
                  <input required type="text" className="w-full p-3 lg:p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-medium-carmine-600 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Email Address</label>
                  <input required type="email" className="w-full p-3 lg:p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-medium-carmine-600 transition-all" />
                </div>
                <button type="submit" className="w-full py-4 lg:py-5 bg-medium-carmine-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-medium-carmine-700 transition-all mt-4 shadow-xl shadow-medium-carmine-100">
                  Submit Reservation
                </button>
              </form>
            </div>
          )}

          {isSuccessOpen && (
            <div className="bg-white w-full max-w-sm p-8 lg:p-12 rounded-2xl shadow-2xl text-center relative animate-[fadeIn_0.3s_ease-out]">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-lg lg:text-xl font-bold uppercase tracking-widest mb-4 text-neutral-900">Inquiry Sent</h2>
              <p className="text-[10px] lg:text-xs text-neutral-500 mb-8 leading-relaxed uppercase tracking-widest font-medium">Your configuration is secured. A concierge will contact you shortly.</p>
              <button 
                onClick={() => setIsSuccessOpen(false)}
                className="w-full py-4 border border-neutral-200 text-neutral-900 text-xs font-bold uppercase tracking-widest hover:bg-neutral-50 transition-all"
              >
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