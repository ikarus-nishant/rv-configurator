import React, { Suspense, useState, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useProgress, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { XR, createXRStore, useXR } from '@react-three/xr';
import ProductModel from './ProductModel';
import { ProductConfig, ConfigCategory } from '../types';

// Initialize XR Store
const store = createXRStore();

// Custom Loader Component
const Loader = () => {
  const { active, progress } = useProgress();
  
  return (
    <div 
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#f0f0f0] transition-opacity duration-1000 ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="flex flex-col items-center">
         <div className="text-2xl md:text-3xl font-light mb-8 tracking-tight text-neutral-900 animate-pulse">
            Ikarus <span className="font-semibold text-medium-carmine-700">Delta</span>
         </div>
         
         <div className="w-48 h-[2px] bg-neutral-200 relative overflow-hidden rounded-full">
            <div 
              className="absolute top-0 left-0 h-full bg-medium-carmine-600 transition-all duration-200 ease-out" 
              style={{ width: `${progress}%` }} 
            />
         </div>
         
         <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
            Loading Assets {Math.round(progress)}%
         </p>
      </div>
    </div>
  );
};

interface SceneProps {
  config: ProductConfig;
  activeTab: ConfigCategory;
}

interface SceneContentProps extends SceneProps {
  resetTrigger: number;
  activeWaypoint: string;
  onWaypointChange: (wp: string) => void;
}

// Inner Component to handle XR-specific logic
const SceneContent: React.FC<SceneContentProps> = ({ config, activeTab, resetTrigger, activeWaypoint, onWaypointChange }) => {
  const mode = useXR(state => state.mode);
  const isPresenting = mode === 'immersive-ar' || mode === 'immersive-vr';

  // Memoize the target to prevent OrbitControls from resetting on every render
  const controlsTarget = useMemo(() => [0, 1, 0], []);

  return (
    <>
      <group position={[0, isPresenting ? -1 : -0.5, isPresenting ? -2 : 0]}>
        <ProductModel 
          config={config} 
          activeTab={activeTab} 
          resetTrigger={resetTrigger}
          activeWaypoint={activeWaypoint}
          onWaypointChange={onWaypointChange}
        />
        <ContactShadows 
          opacity={0.4} 
          scale={30} 
          blur={2.5} 
          far={4} 
          resolution={1024} 
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

      {/* Disable Orbit Controls when in AR to allow user to walk around */}
      {!isPresenting && (
        <>
            <OrbitControls 
            makeDefault 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2} 
            enableZoom={true} 
            enablePan={true}
            target={controlsTarget} 
            />
            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                <GizmoViewport axisColors={['#ba3b32', '#2f7f4f', '#3b5b9d']} labelColor="black" />
            </GizmoHelper>
        </>
      )}

      {/* Hide Environment background in AR so the camera feed shows through */}
      <Environment 
        background={false}
        files="https://dl.dropbox.com/scl/fi/9vvvxhgsu1yz6rmpgk3p9/derelict_airfield_01_1k.hdr?rlkey=igw56hsg85gnyyf5qykmh021b&dl=1"
      />
    </>
  );
};

const Scene: React.FC<SceneProps> = ({ config, activeTab }) => {
  const [resetTrigger, setResetTrigger] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [activeWaypoint, setActiveWaypoint] = useState('Waypoint1');

  // Reset waypoint when entering interior tab
  useEffect(() => {
    if (activeTab === ConfigCategory.INTERIOR) {
      setActiveWaypoint('Waypoint1');
    }
  }, [activeTab]);

  const qrUrl = encodeURIComponent(`${window.location.origin}${window.location.pathname}?ar=true&material=${config.material}`);
  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrUrl}&color=3f1310`;

  const waypoints = ['Waypoint1', 'Waypoint2', 'Waypoint3'];

  return (
    <div className="w-full h-full bg-[#f0f0f0] relative">
       <Loader />
       
       {/* Logo Overlay */}
       <a 
         href="https://www.ikarusdelta.com/" 
         target="_blank" 
         rel="noopener noreferrer"
         className="absolute top-6 left-6 z-10 block cursor-pointer"
       >
         <img 
          src="https://cdn.prod.website-files.com/65792fa13a1bbf4d8e520e33/65ddb66c43de033385b8502b_Delta-new-logo%20(1).avif" 
          alt="Delta Logo" 
          className="w-24 md:w-32 lg:w-40 object-contain"
        />
       </a>

       {/* Interior Navigation Buttons Overlay - Visible whenever in Interior Tab */}
      {activeTab === ConfigCategory.INTERIOR && (
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20 pointer-events-auto">
          {waypoints.map((wp, index) => {
            const isActive = activeWaypoint === wp;
            return (
              <button
                key={wp}
                onClick={() => setActiveWaypoint(wp)}
                className={`w-12 h-12 md:w-16 md:h-16 border-2 flex items-center justify-center transition-all duration-300 shadow-md backdrop-blur-sm
                  ${isActive 
                    ? 'border-medium-carmine-600 bg-white text-medium-carmine-700' 
                    : 'border-white/60 bg-white/20 hover:bg-white/40 text-neutral-600 hover:border-white'
                  }`}
                aria-label={`Go to view ${index + 1}`}
              >
                 <span className="font-medium text-lg">{index + 1}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Action Buttons Overlay - Styled to match Configurator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 w-full justify-center pointer-events-none">
        <button 
          onClick={() => setResetTrigger(prev => prev + 1)}
          className="pointer-events-auto py-3 px-8 bg-white border border-neutral-300 text-neutral-900 text-sm font-medium uppercase tracking-widest hover:border-neutral-900 transition-colors shadow-lg min-w-[160px]"
        >
          Reset Camera
        </button>

        <button 
          onClick={() => setShowQR(true)}
          className="pointer-events-auto py-3 px-8 bg-medium-carmine-600 text-white text-sm font-medium uppercase tracking-widest hover:bg-medium-carmine-700 transition-colors shadow-lg min-w-[160px] border border-transparent"
        >
          View in AR
        </button>
      </div>

       {/* QR Code Modal */}
       {showQR && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white p-8 rounded-lg shadow-2xl flex flex-col items-center max-w-sm w-full relative">
            <button 
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
            >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
               </svg>
            </button>
            
            <h3 className="text-xl font-light text-neutral-900 mb-2">View in your space</h3>
            <p className="text-xs text-neutral-500 mb-6 text-center uppercase tracking-wider">Scan with your mobile device</p>
            
            <div className="p-2 border border-neutral-100 rounded-lg shadow-inner bg-neutral-50 mb-6">
               <img src={qrImageSrc} alt="AR QR Code" className="w-48 h-48 mix-blend-multiply" />
            </div>

            <p className="text-center text-xs text-neutral-400 leading-relaxed px-4">
              Point your phone camera at the QR code to visualize your configured Delta in Augmented Reality.
            </p>
          </div>
        </div>
       )}

       {/* 3D Canvas */}
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 3, 16], fov: 22 }} resize={{ debounce: 0 }}>
        <XR store={store}>
          <Suspense fallback={null}>
            <SceneContent 
              config={config} 
              activeTab={activeTab} 
              resetTrigger={resetTrigger} 
              activeWaypoint={activeWaypoint}
              onWaypointChange={setActiveWaypoint}
            />
          </Suspense>
        </XR>
      </Canvas>
    </div>
  );
};

export default Scene;