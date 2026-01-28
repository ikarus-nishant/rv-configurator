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

// Helper component moved outside to prevent re-creation on every render
const SummaryLine = ({ label, value, price }: { label: string, value?: string, price?: number }) => (
  <div className="flex justify-between items-baseline py-3 border-b border-neutral-50 last:border-0 group">
    <div className="flex flex-col">
      <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1 group-hover:text-medium-carmine-600 transition-colors">{label}</span>
      <span className="text-sm text-neutral-900 font-medium">{value || 'Selection Pending'}</span>
    </div>
    <span className="text-sm font-medium text-neutral-900 tabular-nums">
      {(price === undefined || price === 0) ? 'Included' : `+$${price.toLocaleString()}`}
    </span>
  </div>
);

const Configurator: React.FC<ConfiguratorProps> = ({ config, setConfig, activeTab, setActiveTab }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const scrollTabs = (direction: 'left' | 'right') => {
    triggerHaptic(5);
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
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

  // Safe getter for single-select options to avoid undefined errors
  const getSingleOption = (key: keyof ProductConfig) => {
    const details = getSelectedOptionDetails(key);
    return details[0]; // Can be undefined, SummaryLine handles it
  };

  return (
    <>
      <div className="flex flex-col h-full bg-white text-neutral-900 overflow-hidden relative z-0">
        
        {/* Mobile Tabs */}
        <div className="flex lg:hidden items-center border-b border-neutral-100 bg-white relative flex-none shadow-sm z-10">
          <button onClick={() => scrollTabs('left')} className="p-3 text-neutral-400 focus:outline-none active:text-neutral-900">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </button>
          <div ref={scrollContainerRef} className="flex overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap flex-1 px-2">
            {CONFIG_DATA.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleTabClick(cat.id)}
                className={`px-4 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-200 relative shrink-0 ${activeTab === cat.id ? 'text-medium-carmine-700' : 'text-neutral-400 hover:text-neutral-600'}`}
              >
                {cat.id}
                {activeTab === cat.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-medium-carmine-600 rounded-t-full" />}
              </button>
            ))}
          </div>
          <button onClick={() => scrollTabs('right')} className="p-3 text-neutral-400 focus:outline-none active:text-neutral-900">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </button>
        </div>

        {/* Options Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 lg:p-8 space-y-8">
          {activeTab === ConfigCategory.SUMMARY ? (
            <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
              <div>
                <h3 className="text-xs text-neutral-400 uppercase tracking-[0.2em] font-bold mb-6 pb-2 border-b border-neutral-100">Build Specification</h3>
                <div className="space-y-1">
                   <SummaryLine 
                     label="Model" 
                     value={getSingleOption('size')?.label} 
                     price={getSingleOption('size')?.price} 
                   />
                   <SummaryLine 
                     label="Floorplan" 
                     value={getSingleOption('floorplan')?.label} 
                     price={getSingleOption('floorplan')?.price} 
                   />
                   <SummaryLine 
                     label="Exterior Shell" 
                     value={getSingleOption('material')?.label} 
                     price={getSingleOption('material')?.price} 
                   />
                   <SummaryLine 
                     label="Interior Decor" 
                     value={getSingleOption('interior')?.label} 
                     price={getSingleOption('interior')?.price} 
                   />
                   <SummaryLine 
                     label="Cabinetry" 
                     value={getSingleOption('cabinets')?.label} 
                     price={getSingleOption('cabinets')?.price} 
                   />
                   
                   {config.exterior.length > 0 && (
                     <div className="pt-4 mt-2">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-2">Installed Packages</span>
                        {getSelectedOptionDetails('exterior').map((opt, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2 text-sm text-neutral-600">
                             <span>{opt.label}</span>
                             <span className="font-medium tabular-nums">+${(opt.price || 0).toLocaleString()}</span>
                          </div>
                        ))}
                     </div>
                   )}
                </div>
              </div>
            </div>
          ) : (
            activeCategoryData?.sections.map((section, index) => (
              <div key={index} className="space-y-4 animate-[slideIn_0.3s_ease-out]">
                 {section.title && (
                   <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-400 ml-1">{section.title}</h3>
                 )}
                 <div className="grid grid-cols-1 gap-4">
                  {section.options.map((option) => {
                    if (option.availableForSize && !option.availableForSize.includes(config.size)) return null;
                    const configValue = config[section.stateKey];
                    const isSelected = Array.isArray(configValue) ? configValue.includes(option.id) : configValue === option.id;
                    const iconToDisplay = option.icon || PLACEHOLDER_ICON;
                    
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleOptionSelect(section.stateKey, option.id, section.multiSelect)}
                        className={`
                          group relative flex items-start p-4 lg:p-5 text-left transition-all duration-200 w-full rounded-2xl
                          border active:scale-[0.98] outline-none
                          ${isSelected 
                            ? 'border-medium-carmine-600 bg-white ring-1 ring-medium-carmine-600 shadow-lg shadow-medium-carmine-100/50' 
                            : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md'
                          }
                        `}
                      >
                        <div className="w-24 h-24 lg:w-32 lg:h-24 rounded-xl overflow-hidden border border-neutral-100 flex-shrink-0 mr-5 bg-neutral-50 relative">
                            <img src={iconToDisplay} alt={option.label} className="w-full h-full object-contain p-2 mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex-1 min-w-0 py-1 flex flex-col justify-between h-full">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <span className={`text-sm lg:text-base font-bold uppercase tracking-wider leading-tight ${isSelected ? 'text-medium-carmine-700' : 'text-neutral-900'}`}>
                                {option.label}
                              </span>
                              {isSelected && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-medium-carmine-600 shrink-0">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            {option.description && (
                              <p className="text-xs text-neutral-500 mt-2 leading-relaxed pr-2 font-medium">
                                {option.description}
                              </p>
                            )}
                          </div>
                          
                          {option.price !== undefined && (
                            <div className="mt-3 text-right">
                                <span className={`text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-md ${isSelected ? 'bg-medium-carmine-50 text-medium-carmine-700' : 'bg-neutral-100 text-neutral-600'}`}>
                                    {option.price === 0 ? 'Included' : `+$${option.price.toLocaleString()}`}
                                </span>
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

        {/* Footer Summary */}
        <div className="border-t border-neutral-100 bg-white/95 backdrop-blur-sm flex-none z-20">
          {/* Mobile Footer */}
          <div className="lg:hidden p-4 pb-8 flex items-center justify-between gap-4">
            <button 
              onClick={handlePreviousStep} 
              disabled={currentStepIndex === 0} 
              className={`p-4 rounded-full border border-neutral-200 transition-all active:scale-95 ${currentStepIndex === 0 ? 'opacity-30 border-transparent bg-neutral-50' : 'bg-white shadow-sm active:bg-neutral-50'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-0.5">Total Estimate</span>
              <span className="text-xl font-medium text-neutral-900 tracking-tight tabular-nums">${calculateTotal().toLocaleString()}</span>
            </div>
            <button 
              onClick={handleNextStep} 
              className={`p-4 rounded-full transition-all shadow-lg active:scale-95 flex items-center justify-center ${isLastStep ? 'bg-medium-carmine-600 text-white shadow-medium-carmine-200' : 'bg-neutral-900 text-white shadow-neutral-200'}`}
            >
               {isLastStep ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" /></svg> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>}
            </button>
          </div>

          {/* Desktop Footer */}
          <div className="hidden lg:block p-8">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-xs text-neutral-400 uppercase tracking-widest font-bold mb-2">Estimated Total</p>
                <div className="text-4xl font-light text-neutral-900 tracking-tight tabular-nums">${calculateTotal().toLocaleString()}</div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold max-w-[200px] leading-relaxed">
                   *Excludes taxes and destination fees
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handlePreviousStep} 
                disabled={currentStepIndex === 0} 
                className={`flex-1 py-4 border border-neutral-200 text-neutral-900 text-xs font-bold uppercase tracking-[0.15em] transition-all active:scale-[0.98] ${currentStepIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-neutral-50 hover:border-neutral-300'}`}
              >
                Back
              </button>
              <button 
                onClick={handleNextStep} 
                className="flex-[2] py-4 bg-medium-carmine-600 text-white text-xs font-bold uppercase tracking-[0.15em] hover:bg-medium-carmine-700 transition-all shadow-xl shadow-medium-carmine-200 active:scale-[0.98]"
              >
                {isLastStep ? 'Request Quote' : 'Next Step'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {(isFormOpen || isSuccessOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm transition-all">
          {isFormOpen && (
            <div className="bg-white w-full max-w-md p-8 lg:p-12 rounded-3xl shadow-2xl relative animate-[scaleIn_0.2s_ease-out]">
              <button onClick={() => { triggerHaptic(); setIsFormOpen(false); }} className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h2 className="text-2xl font-bold uppercase tracking-wide mb-2 text-neutral-900">Reserve Build</h2>
              <p className="text-xs text-neutral-500 mb-8 uppercase tracking-widest font-bold">Connect with a specialist</p>
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Full Name</label>
                  <input required type="text" className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-medium-carmine-600/20 focus:border-medium-carmine-600 transition-all placeholder:text-neutral-300" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Email Address</label>
                  <input required type="email" className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-medium-carmine-600/20 focus:border-medium-carmine-600 transition-all placeholder:text-neutral-300" placeholder="john@example.com" />
                </div>
                <button type="submit" className="w-full py-5 bg-medium-carmine-600 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-medium-carmine-700 transition-all mt-4 rounded-xl shadow-lg shadow-medium-carmine-200 active:scale-[0.98]">
                  Submit Reservation
                </button>
              </form>
            </div>
          )}
          {isSuccessOpen && (
            <div className="bg-white w-full max-w-sm p-10 lg:p-14 rounded-3xl shadow-2xl text-center relative animate-[scaleIn_0.2s_ease-out]">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-green-100">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-2xl font-bold uppercase tracking-wide mb-4 text-neutral-900">Inquiry Sent</h2>
              <p className="text-sm text-neutral-500 mb-10 leading-relaxed font-medium">Your configuration is secured. A concierge will contact you shortly.</p>
              <button onClick={() => { triggerHaptic(); setIsSuccessOpen(false); }} className="w-full py-4 border border-neutral-200 text-neutral-900 text-xs font-bold uppercase tracking-[0.15em] hover:bg-neutral-50 rounded-xl transition-all active:scale-[0.98]">
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
