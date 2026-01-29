import React, { Suspense, useState, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useProgress } from '@react-three/drei';
import { XR, createXRStore, useXR } from '@react-three/xr';
import ProductModel from './ProductModel';
import { ProductConfig, ConfigCategory } from '../types';
import { triggerHaptic } from '../utils/haptics';

// Ensure all R3F elements used are defined in JSX.IntrinsicElements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      ambientLight: any;
      spotLight: any;
      primitive: any;
      mesh: any;
      sphereGeometry: any;
      meshBasicMaterial: any;
    }
  }
}

// Initialize XR Store
const store = createXRStore();

// Custom Loader Component
const Loader = ({ forcedActive = false }: { forcedActive?: boolean }) => {
  const { active, progress } = useProgress();
  const isActuallyActive = forcedActive || active;
  
  return (
    <div 
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#f0f0f0] transition-opacity duration-500 ${isActuallyActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="flex flex-col items-center px-6 text-center">
         <div className="text-xl lg:text-3xl font-light mb-8 tracking-tight text-neutral-900 animate-pulse">
            Ikarus <span className="font-semibold text-medium-carmine-700">Delta</span>
         </div>
         
         <div className="w-40 lg:w-48 h-[2px] bg-neutral-200 relative overflow-hidden rounded-full">
            <div 
              className="absolute top-0 left-0 h-full bg-medium-carmine-600 transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }} 
            />
         </div>
         
         <p className="mt-4 text-[9px] lg:text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold">
            {progress < 100 ? `Synchronizing Assets ${Math.round(progress)}%` : 'Initializing View...'}
         </p>
      </div>
    </div>
  );
};

interface SceneProps {
  config: ProductConfig;
  activeTab: ConfigCategory;
  onEnterAR?: () => void;
}

interface SceneContentProps extends Omit<SceneProps, 'onEnterAR'> {
  resetTrigger: number;
  activeWaypoint: string;
  onWaypointChange: (wp: string) => void;
  onTransitionStateChange: (state: boolean) => void;
}

const SceneContent: React.FC<SceneContentProps> = ({ config, activeTab, resetTrigger, activeWaypoint, onWaypointChange, onTransitionStateChange }) => {
  const mode = useXR(state => state.mode);
  const isPresenting = mode === 'immersive-ar' || mode === 'immersive-vr';
  const controlsTarget = useMemo(() => [0, 1, 0], []);
  const isFloorplan = activeTab === ConfigCategory.FLOORPLAN;
  const isInterior = activeTab === ConfigCategory.INTERIOR;
  const Controls = OrbitControls as any;

  return (
    <>
      <group position={[0, isPresenting ? -1 : -0.5, isPresenting ? -2 : 0]}>
        <ProductModel 
          config={config} 
          activeTab={activeTab} 
          resetTrigger={resetTrigger}
          activeWaypoint={activeWaypoint}
          onWaypointChange={onWaypointChange}
          onTransitionStateChange={onTransitionStateChange}
        />
        <ContactShadows 
          opacity={0.3} 
          scale={30} 
          blur={3} 
          far={5} 
          resolution={512} 
          color="#000000"
        />
      </group>
      
      <ambientLight intensity={0.4} />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={1} 
        castShadow 
      />

      {!isPresenting && (
        <Controls 
            makeDefault 
            minPolarAngle={0} 
            maxPolarAngle={isFloorplan ? 0 : (isInterior ? Math.PI : Math.PI / 2)} 
            enableZoom={true} 
            enablePan={true}
            enableRotate={!isFloorplan}
            target={controlsTarget} 
        />
      )}

      <Environment 
        background={false}
        files="https://dl.dropbox.com/scl/fi/9vvvxhgsu1yz6rmpgk3p9/derelict_airfield_01_1k.hdr?rlkey=igw56hsg85gnyyf5qykmh021b&dl=1"
      />
    </>
  );
};

const Scene: React.FC<SceneProps> = ({ config, activeTab, onEnterAR }) => {
  const [resetTrigger, setResetTrigger] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [activeWaypoint, setActiveWaypoint] = useState('Waypoint1');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (activeTab === ConfigCategory.INTERIOR) {
      setActiveWaypoint('Waypoint1');
    }
  }, [activeTab]);

  const handleARClick = () => {
    triggerHaptic();
    const isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobileOrTablet && onEnterAR) {
      onEnterAR();
    } else {
      setShowQR(true);
    }
  };

  const handleResetClick = () => {
    triggerHaptic();
    setResetTrigger(prev => prev + 1);
  };

  const qrUrl = encodeURIComponent(`${window.location.origin}${window.location.pathname}?ar=true&material=${config.material}`);
  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrUrl}&color=3f1310`;

  return (
    <div className="w-full h-full bg-[#f0f0f0] relative">
       <Loader forcedActive={isTransitioning} />
       
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 w-full justify-center pointer-events-none px-4">
        {/* Reset View Button */}
        <button 
          onClick={handleResetClick}
          className="pointer-events-auto w-12 h-12 flex items-center justify-center bg-white rounded-full text-neutral-900 shadow-lg hover:bg-neutral-50 hover:scale-105 active:scale-95 transition-all"
          title="Reset View"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
             <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>

        {/* AR Button */}
        <button 
          onClick={handleARClick}
          className="pointer-events-auto w-12 h-12 flex items-center justify-center bg-medium-carmine-600 text-white rounded-full shadow-lg shadow-medium-carmine-600/30 hover:bg-medium-carmine-700 hover:scale-105 active:scale-95 transition-all"
          title="View in AR"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
          </svg>
        </button>
      </div>

       {showQR && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-white p-6 lg:p-10 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full relative">
            <button 
              onClick={() => { triggerHaptic(); setShowQR(false); }}
              className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 transition-colors"
            >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
               </svg>
            </button>
            
            <h3 className="text-lg lg:text-xl font-bold text-neutral-900 mb-2 uppercase tracking-widest">AR Portal</h3>
            <p className="text-[10px] text-neutral-400 mb-8 text-center uppercase tracking-widest font-bold">Scan to launch experience</p>
            
            <div className="p-3 border border-neutral-100 rounded-2xl shadow-inner bg-neutral-50 mb-8">
               <img src={qrImageSrc} alt="AR QR Code" className="w-40 h-40 lg:w-48 lg:h-48 mix-blend-multiply" />
            </div>

            <p className="text-center text-[10px] text-neutral-400 leading-relaxed uppercase tracking-widest font-bold px-4">
              Requires an AR-compatible mobile device
            </p>
          </div>
        </div>
       )}

      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 3, 16], fov: 22 }} resize={{ debounce: 0 }}>
        <XR store={store}>
          <Suspense fallback={null}>
            <SceneContent 
              config={config} 
              activeTab={activeTab} 
              resetTrigger={resetTrigger} 
              activeWaypoint={activeWaypoint}
              onWaypointChange={setActiveWaypoint}
              onTransitionStateChange={setIsTransitioning}
            />
          </Suspense>
        </XR>
      </Canvas>
    </div>
  );
};

export default Scene;