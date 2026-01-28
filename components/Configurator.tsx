import React, { useState, useRef } from 'react';
import { CONFIG_DATA } from '../constants';
import { ProductConfig, ConfigCategory } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface ConfiguratorProps {
  config: ProductConfig;
  setConfig: React.Dispatch<React.SetStateAction<ProductConfig>>;
  activeTab: ConfigCategory;
  setActiveTab: React.Dispatch<React.SetStateAction<ConfigCategory>>;
}

const PLACEHOLDER_ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f5f5f5'/%3E%3Cpath d='M30 50 L70 50 M50 30 L50 70' stroke='%23dcdcdc' stroke-width='2'/%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='8' font-weight='bold' fill='%23bbbbbb' text-transform='uppercase' letter-spacing='1'%3EIKARUS%3C/text%3E%3C/svg%3E";

const Configurator: React.FC<ConfiguratorProps> = ({ config, setConfig, activeTab, setActiveTab }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const scrollTabs = (direction: 'left' | 'right') => {
    triggerHaptic(5);
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

  const handleTabClick = (id: ConfigCategory) => {
    triggerHaptic(8);
    setActiveTab(id);
  };

  const handleNextStep = () => {
    triggerHaptic(12);
    if (isLastStep) {
      setIsFormOpen(true);
    } else {
      const nextCategory = CONFIG_DATA[currentStepIndex + 1];
      if (nextCategory) setActiveTab(nextCategory.id);
    }
  };

  const handlePreviousStep = () => {
    triggerHaptic(8);
    if (currentStepIndex > 0) {
      const prevCategory = CONFIG_DATA[currentStepIndex - 1];
      if (prevCategory) setActiveTab(prevCategory.id);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(20);
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
          <button onClick={() => scrollTabs('left')} className="p-3 text-neutral-400 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </button>
          <div ref={scrollContainerRef} className="flex overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap flex-1">
            {CONFIG_DATA.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleTabClick(cat.id)}
                className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors duration-200 relative shrink-0 ${activeTab === cat.id ? 'text-medium-carmine-700' : 'text-neutral-400'}`}
              >
                {cat.id}
                {activeTab === cat.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-medium-carmine-600" />}
              </button>
            ))}
          </div>
          <button onClick={() => scrollTabs('right')} className="p-3 text-neutral-400 focus:outline-none">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </button>
        </div>

        {/* Options Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 space-y-6 lg:space-y-8">
          {activeTab === ConfigCategory.SUMMARY ? (
            <div className="space-y-6 lg:space-y-8 animate-[fadeIn_0.3s_ease-out]">
              <div>
                <h3 className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-4 pb-2 border-b border-neutral-100">Configuration Details</h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-start">
                      <div><span className="block text-[10px] font-bold text-neutral-900 uppercase tracking-wider mb-0.5">Model</span><span className="text-sm text-neutral-600">{getSelectedOptionDetails('size')[0]?.label}</span></div>
                      <span className="text-sm font-medium text-neutral-900">${getSelectedOptionDetails('size')[0]?.price.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-start">
                      <div><span className="block text-[10px] font-bold text-neutral-900 uppercase tracking-wider mb-0.5">Floorplan</span><span className="text-sm text-neutral-600">{getSelectedOptionDetails('floorplan')[0]?.label}</span></div>
                      <span className="text-sm font-medium text-neutral-900">{getSelectedOptionDetails('floorplan')[0]?.price === 0 ? 'Included' : `+$${getSelectedOptionDetails('floorplan')[0]?.price.toLocaleString()}`}</span>
                   </div>
                   <div className="flex justify-between items-start">
                      <div><span className="block text-[10px] font-bold text-neutral-900 uppercase tracking-wider mb-0.5">Exterior Shell</span><span className="text-sm text-neutral-600">{getSelectedOptionDetails('material')[0]?.label}</span></div>
                      <span className="text-sm font-medium text-neutral-900">{getSelectedOptionDetails('material')[0]?.price === 0 ? 'Included' : `+$${getSelectedOptionDetails('material')[0]?.price.toLocaleString()}`}</span>
                   </div>
                   <div className="flex justify-between items-start">
                      <div><span className="block text-[10px] font-bold text-neutral-900 uppercase tracking-wider mb-0.5">Upholstery</span><span className="text-sm text-neutral-600">{getSelectedOptionDetails('interior')[0]?.label}</span></div>
                      <span className="text-sm font-medium text-neutral-900">{getSelectedOptionDetails('interior')[0]?.price === 0 ? 'Included' : `+$${getSelectedOptionDetails('interior')[0]?.price.toLocaleString()}`}</span>
                   </div>
                   <div className="flex justify-between items-start">
                      <div><span className="block text-[10px] font-bold text-neutral-900 uppercase tracking-wider mb-0.5">Cabinets</span><span className="text-sm text-neutral-600">{getSelectedOptionDetails('cabinets')[0]?.label}</span></div>
                      <span className="text-sm font-medium text-neutral-900">{getSelectedOptionDetails('cabinets')[0]?.price === 0 ? 'Included' : `+$${getSelectedOptionDetails('cabinets')[0]?.price.toLocaleString()}`}</span>
                   </div>
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
                    if (option.availableForSize && !option.availableForSize.includes(config.size)) return null;
                    const configValue = config[section.stateKey];
                    const isSelected = Array.isArray(configValue) ? configValue.includes(option.id) : configValue === option.id;
                    const iconToDisplay = option.icon || PLACEHOLDER_ICON;
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleOptionSelect(section.stateKey, option.id, section.multiSelect)}
                        className={`group relative flex items-start p-3.5 lg:p-4 border rounded-xl text-left transition-all duration-300 w-full ${isSelected ? 'border-medium-carmine-600 bg-medium-carmine-50/30 ring-1 ring-medium-carmine-600' : 'border-neutral-100 hover:border-neutral-300'}`}
                      >
                        <div className="w-24 lg:w-32 h-16 lg:h-20 rounded-lg overflow-hidden border border-neutral-200 flex-shrink-0 mr-4 bg-white relative">
                            <img src={iconToDisplay} alt={option.label} className="w-full h-full object-contain p-1" />
                            {option.colorCode && <div className="absolute top-1 right-1 w-3 h-3 rounded-full border border-white shadow-sm" style={{ backgroundColor: option.colorCode }} />}
                        </div>
                        <div className="flex-1 min-w-0 py-0.5">
                          <div className="font-bold text-[10px] lg:text-xs text-neutral-900 uppercase tracking-widest leading-tight">{option.label}</div>
                          {option.description && <div className="text-[10px] lg:text-xs text-neutral-500 mt-2 leading-relaxed line-clamp-2 pr-12">{option.description}</div>}
                        </div>
                        {option.price !== undefined && (
                            <div className="absolute bottom-2 right-2 lg:bottom-3 lg:right-3 z-10">
                                <span className="text-[9px] lg:text-[10px] font-bold text-neutral-900 uppercase tracking-tight">
                                    {option.price === 0 ? 'INCL.' : `+$${option.price.toLocaleString()}`}
                                </span>
                            </div>
                        )}
                      </button>
                    );
                  })}
                 </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        <div className="border-t border-neutral-100 bg-white flex-none">
          {/* Mobile Footer */}
          <div className="lg:hidden p-4 pb-8 flex items-center justify-between gap-4">
            <button onClick={handlePreviousStep} disabled={currentStepIndex === 0} className={`p-3 rounded-full border border-neutral-200 transition-all ${currentStepIndex === 0 ? 'opacity-30 border-transparent bg-neutral-50' : 'bg-white shadow-sm'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Estimated Price</span>
              <span className="text-xl font-light text-neutral-900 tracking-tight">${calculateTotal().toLocaleString()}</span>
            </div>
            <button onClick={handleNextStep} className={`p-3 rounded-full transition-all shadow-lg flex items-center justify-center ${isLastStep ? 'bg-medium-carmine-600 text-white' : 'bg-white border border-neutral-200 text-neutral-900'}`}>
               {isLastStep ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" /></svg> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>}
            </button>
          </div>

          {/* Desktop Footer */}
          <div className="hidden lg:block p-8">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-1">Estimated Price</p>
                <div className="text-3xl font-light text-neutral-900 tracking-tight">${calculateTotal().toLocaleString()}</div>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={handlePreviousStep} disabled={currentStepIndex === 0} className={`flex-1 py-4 border border-neutral-200 text-neutral-900 text-xs font-bold uppercase tracking-widest ${currentStepIndex === 0 ? 'opacity-20' : 'hover:bg-neutral-50'}`}>Back</button>
              <button onClick={handleNextStep} className="flex-[2] py-4 bg-medium-carmine-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-medium-carmine-700 transition-all shadow-xl shadow-medium-carmine-200">{isLastStep ? 'Request Quote' : 'Next Step'}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {(isFormOpen || isSuccessOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          {isFormOpen && (
            <div className="bg-white w-full max-w-md p-6 lg:p-10 rounded-2xl shadow-2xl relative animate-[fadeIn_0.3s_ease-out]">
              <button onClick={() => { triggerHaptic(); setIsFormOpen(false); }} className="absolute top-6 right-6 text-neutral-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              <h2 className="text-lg lg:text-xl font-bold uppercase tracking-widest mb-2 text-neutral-900">Reserve Your Build</h2>
              <p className="text-[10px] lg:text-xs text-neutral-500 mb-8 uppercase tracking-widest font-medium">Connect with an authorized specialist</p>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div><label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Full Name</label><input required type="text" className="w-full p-3 lg:p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none" /></div>
                <div><label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Email Address</label><input required type="email" className="w-full p-3 lg:p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none" /></div>
                <button type="submit" className="w-full py-4 lg:py-5 bg-medium-carmine-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-medium-carmine-700 transition-all mt-4">Submit Reservation</button>
              </form>
            </div>
          )}
          {isSuccessOpen && (
            <div className="bg-white w-full max-w-sm p-8 lg:p-12 rounded-2xl shadow-2xl text-center relative animate-[fadeIn_0.3s_ease-out]">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
              <h2 className="text-lg lg:text-xl font-bold uppercase tracking-widest mb-4 text-neutral-900">Inquiry Sent</h2>
              <p className="text-[10px] lg:text-xs text-neutral-500 mb-8 leading-relaxed uppercase tracking-widest font-medium">Your configuration is secured. A concierge will contact you shortly.</p>
              <button onClick={() => { triggerHaptic(); setIsSuccessOpen(false); }} className="w-full py-4 border border-neutral-200 text-neutral-900 text-xs font-bold uppercase tracking-widest hover:bg-neutral-50">Return to Configurator</button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Configurator;
