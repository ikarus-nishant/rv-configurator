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
    
    // Base price from Size
    const sizeOption = CONFIG_DATA.find(c => c.id === ConfigCategory.SIZE)?.options.find(o => o.id === config.size);
    if (sizeOption?.price) total += sizeOption.price;

    // Add-ons
    CONFIG_DATA.forEach(cat => {
      if (cat.id === ConfigCategory.EXTERIOR) {
        cat.options.forEach(opt => {
          if (config.exterior.includes(opt.id) && opt.price) total += opt.price;
        });
      }
      if (cat.id === ConfigCategory.INTERIOR) {
        // Find selected interior option (now single select logic in constants, but check data structure)
        if (config.interior.length > 0) {
             const selectedInterior = cat.options.find(o => config.interior.includes(o.id));
             if (selectedInterior?.price) total += selectedInterior.price;
        }
      }
      if (cat.id === ConfigCategory.MATERIAL) {
        const selectedMaterial = cat.options.find(o => config.material === o.id);
        if (selectedMaterial?.price) total += selectedMaterial.price;
      }
    });

    return total;
  };

  const handleOptionSelect = (categoryId: ConfigCategory, optionId: string) => {
    setConfig(prev => {
      const newConfig = { ...prev };
      
      if (categoryId === ConfigCategory.SIZE) {
        newConfig.size = optionId as any;
      } else if (categoryId === ConfigCategory.MATERIAL) {
        newConfig.material = optionId as any;
      } else if (categoryId === ConfigCategory.EXTERIOR) {
        const current = prev.exterior;
        newConfig.exterior = current.includes(optionId) 
          ? current.filter(id => id !== optionId)
          : [...current, optionId];
      } else if (categoryId === ConfigCategory.INTERIOR) {
        // Interior is now single select for Decor theme
        newConfig.interior = [optionId];
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

  return (
    <>
      <div className="flex flex-col h-full bg-white text-neutral-900 overflow-hidden shadow-2xl relative z-0">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100">
          <h1 className="text-2xl font-light tracking-tight">Flying <span className="font-semibold text-medium-carmine-700">Cloud</span></h1>
          <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">Travel Trailer</p>
        </div>

        {/* Tabs with Arrows */}
        <div className="flex items-center border-b border-neutral-100 bg-white relative">
          <button 
            onClick={() => scrollTabs('left')}
            className="p-4 text-neutral-400 hover:text-medium-carmine-600 hover:bg-neutral-50 transition-colors z-10 focus:outline-none"
            aria-label="Scroll Left"
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
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 relative shrink-0
                  ${activeTab === cat.id ? 'text-medium-carmine-700' : 'text-neutral-400 hover:text-neutral-600'}
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
            className="p-4 text-neutral-400 hover:text-medium-carmine-600 hover:bg-neutral-50 transition-colors z-10 focus:outline-none"
            aria-label="Scroll Right"
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* Options Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
          <h2 className="text-lg font-light mb-4">{activeTab}</h2>
          
          <div className="grid grid-cols-1 gap-3">
            {activeCategoryData?.options.map((option) => {
              const isSelected = 
                activeTab === ConfigCategory.SIZE ? config.size === option.id :
                activeTab === ConfigCategory.MATERIAL ? config.material === option.id :
                activeTab === ConfigCategory.EXTERIOR ? config.exterior.includes(option.id) :
                activeTab === ConfigCategory.INTERIOR ? config.interior.includes(option.id) : false;

              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(activeTab, option.id)}
                  className={`group flex items-start p-4 border rounded-lg text-left transition-all duration-200 w-full
                    ${isSelected ? 'border-medium-carmine-600 bg-medium-carmine-50 ring-1 ring-medium-carmine-600' : 'border-neutral-200 hover:border-neutral-400'}
                  `}
                >
                  {/* Icon or Color Circle */}
                  {option.icon ? (
                    <img 
                      src={option.icon} 
                      alt={option.label}
                      className="w-32 h-20 rounded-md object-cover border border-neutral-200 flex-shrink-0 mr-4 bg-neutral-100"
                    />
                  ) : option.colorCode ? (
                     <div 
                        className="w-8 h-8 rounded-full border border-neutral-200 shadow-sm flex-shrink-0 mr-4" 
                        style={{ backgroundColor: option.colorCode }}
                     />
                  ) : null}

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-sm text-neutral-900">{option.label}</div>
                      {option.price !== undefined && (
                        <div className="text-sm font-medium text-neutral-900 ml-2 whitespace-nowrap">
                          {option.price === 0 ? 'Included' : `+$${option.price.toLocaleString()}`}
                        </div>
                      )}
                    </div>
                    
                    {option.description && (
                      <div className="text-xs text-neutral-500 mt-1 leading-relaxed">
                        {option.description}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer / Summary */}
        <div className="p-6 border-t border-neutral-100 bg-neutral-50">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider">Estimated Price</p>
              <div className="text-3xl font-light text-neutral-900">${calculateTotal().toLocaleString()}</div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={handlePreviousStep}
              disabled={currentStepIndex === 0}
              className={`flex-1 py-4 border border-neutral-300 text-neutral-900 text-sm font-medium uppercase tracking-widest transition-colors
                ${currentStepIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:border-neutral-900'}
              `}
            >
              Go Back
            </button>
            
            <button 
              onClick={handleNextStep}
              className="flex-1 py-4 bg-medium-carmine-600 text-white text-sm font-medium uppercase tracking-widest hover:bg-medium-carmine-700 transition-colors"
            >
              {isLastStep ? 'Get In Touch' : 'Next Step'}
            </button>
          </div>
        </div>
      </div>

      {/* Modals - Placed outside main div to ensure fixed positioning works as expected */}
      {(isFormOpen || isSuccessOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          {isFormOpen && (
            <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-2xl relative animate-[fadeIn_0.2s_ease-out]">
              <button 
                onClick={() => setIsFormOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <h2 className="text-2xl font-light mb-2">Request Quote</h2>
              <p className="text-sm text-neutral-500 mb-6">Send your configuration to a dealer near you.</p>
              
              <form onSubmit={handleContactSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Full Name</label>
                    <input required type="text" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded text-sm text-neutral-900 focus:outline-none focus:border-medium-carmine-600 focus:ring-1 focus:ring-medium-carmine-600 transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Email Address</label>
                    <input required type="email" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded text-sm text-neutral-900 focus:outline-none focus:border-medium-carmine-600 focus:ring-1 focus:ring-medium-carmine-600 transition-all" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Phone Number</label>
                    <input required type="tel" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded text-sm text-neutral-900 focus:outline-none focus:border-medium-carmine-600 focus:ring-1 focus:ring-medium-carmine-600 transition-all" placeholder="+1 (555) 000-0000" />
                  </div>
                  
                  <button type="submit" className="w-full py-4 bg-medium-carmine-600 text-white text-sm font-medium uppercase tracking-widest hover:bg-medium-carmine-700 transition-colors mt-2 shadow-lg shadow-medium-carmine-200">
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          )}

          {isSuccessOpen && (
            <div className="bg-white w-full max-w-sm p-8 rounded-lg shadow-2xl text-center relative animate-[fadeIn_0.2s_ease-out]">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-xl font-medium mb-2">Request Received</h2>
              <p className="text-sm text-neutral-500 mb-6 leading-relaxed">A dealership representative will contact you within 24 hours to finalize your build.</p>
              <button 
                onClick={() => setIsSuccessOpen(false)}
                className="w-full py-3 border border-neutral-200 text-neutral-900 text-sm font-medium uppercase tracking-widest hover:bg-neutral-50 hover:border-neutral-300 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Configurator;