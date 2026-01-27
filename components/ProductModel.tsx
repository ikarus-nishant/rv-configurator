
import React, { useEffect, useRef, useState, Suspense } from 'react';
import { useGLTF, Html, OrthographicCamera } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { Mesh, Vector3, Object3D, PerspectiveCamera, Quaternion } from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { ProductConfig, ConfigCategory } from '../types';
import { CONFIG_DATA } from '../constants';

interface ProductModelProps {
  config: ProductConfig;
  activeTab?: ConfigCategory;
  resetTrigger?: number;
  activeWaypoint?: string;
  onWaypointChange?: (waypoint: string) => void;
}

const EXTERIOR_URL = 'https://dl.dropbox.com/scl/fi/n893bek5wluovtcl5qtpj/ext.glb?rlkey=9n026wssl8o6kf6sp4iix4lfd&dl=1';
const INTERIOR_URL = 'https://dl.dropbox.com/scl/fi/u2jgaow3rbixi8q6lnufr/int.glb?rlkey=eidbdbto55qmngvzs9xnk4p5j&dl=1';
const FLOORPLAN_URL = 'https://dl.dropbox.com/scl/fi/yn7crt148zi6c3ahpdi8g/fp.glb?rlkey=9cgs7g8t8e74j7b40frp4euc2&dl=1';

const ExteriorModel: React.FC<{ config: ProductConfig }> = ({ config }) => {
  const { scene } = useGLTF(EXTERIOR_URL);

  useEffect(() => {
    // Traverse new structure to find material option
    const materialSection = CONFIG_DATA.find(c => c.id === ConfigCategory.EXTERIOR)
      ?.sections.find(s => s.stateKey === 'material');
    const selectedOption = materialSection?.options.find(o => o.id === config.material);
    const targetColor = selectedOption?.colorCode || '#E0E0E0';

    // Traverse new structure to find exterior addon options
    const exteriorSection = CONFIG_DATA.find(c => c.id === ConfigCategory.EXTERIOR)
      ?.sections.find(s => s.stateKey === 'exterior');
    const exteriorIds = exteriorSection?.options.map(o => o.id) || [];

    scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const associatedOptionId = exteriorIds.find(id => 
          child.name.toLowerCase().includes(id.toLowerCase())
        );

        if (associatedOptionId) {
          child.visible = config.exterior.includes(associatedOptionId);
        }

        if (child.material && (child.material as any).name === 'Steel') {
          (child.material as any).color.set(targetColor);
          
          if (config.material === 'matte_black') {
            (child.material as any).roughness = 0.9;
            (child.material as any).metalness = 0.1;
          } else if (config.material === 'aluminum') {
            (child.material as any).roughness = 0.3;
            (child.material as any).metalness = 1.0;
          } else {
             (child.material as any).roughness = 0.5;
             (child.material as any).metalness = 0.5;
          }
        }
      }
    });
  }, [config, scene]);

  return <primitive object={scene} />;
};

const FloorplanModel: React.FC = () => {
  const { scene } = useGLTF(FLOORPLAN_URL);
  return <primitive object={scene} />;
};

interface InteriorModelProps {
  activeWaypoint: string;
  onTargetFound: (target: Object3D) => void;
  onUserClick: (waypoint: string) => void;
}

const InteriorModel: React.FC<InteriorModelProps> = ({ activeWaypoint, onTargetFound, onUserClick }) => {
  const { scene } = useGLTF(INTERIOR_URL);

  // Sync 3D camera target when activeWaypoint prop changes or model loads
  useEffect(() => {
    const target = scene.getObjectByName(activeWaypoint);
    if (target) {
      onTargetFound(target);
    }
  }, [scene, activeWaypoint, onTargetFound]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    const name = e.object.name;
    let targetName = '';

    if (name.includes('Plane1')) targetName = 'Waypoint1';
    else if (name.includes('Plane2')) targetName = 'Waypoint2';
    else if (name.includes('Plane3')) targetName = 'Waypoint3';

    if (targetName) {
      onUserClick(targetName);
    }
  };

  const handlePointerOver = (e: any) => {
    if (e.object.name.includes('Plane')) {
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto';
  };

  return (
    <primitive 
      object={scene} 
      onClick={handleClick} 
      onPointerOver={handlePointerOver} 
      onPointerOut={handlePointerOut} 
    />
  );
};

const ProductModel: React.FC<ProductModelProps> = ({ config, activeTab, resetTrigger, activeWaypoint = 'Waypoint1', onWaypointChange }) => {
  const { camera, controls } = useThree();
  const [interiorTarget, setInteriorTarget] = useState<Object3D | null>(null);
  
  // -- Transition Logic Start --
  // Determine target view based on tab
  let targetView: 'exterior' | 'interior' | 'floorplan' = 'exterior';
  if (activeTab === ConfigCategory.INTERIOR) targetView = 'interior';
  else if (activeTab === ConfigCategory.FLOORPLAN) targetView = 'floorplan';

  // State to handle current display
  const [displayedView, setDisplayedView] = useState<'exterior' | 'interior' | 'floorplan'>(targetView);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (targetView !== displayedView) {
      // 1. Start Fade Out
      setIsFading(true);
      const fadeDuration = 300;
      
      const t1 = setTimeout(() => {
        // 2. Switch Model
        setDisplayedView(targetView);
        
        // 3. Start Fade In logic
        // For exterior or floorplan, we fade in after a short delay
        if (targetView === 'exterior' || targetView === 'floorplan') {
          const t2 = setTimeout(() => {
            setIsFading(false);
          }, 100);
          return () => clearTimeout(t2);
        }
        // For interior, we wait for the target to be found in the other useEffect
      }, fadeDuration);

      return () => clearTimeout(t1);
    }
  }, [targetView, displayedView]);

  const showInterior = displayedView === 'interior';
  const showFloorplan = displayedView === 'floorplan';
  const showExterior = displayedView === 'exterior';
  // -- Transition Logic End --

  // Camera State
  const defaultPos = new Vector3(0, 3, 16);
  const defaultTarget = new Vector3(0, 1, 0);

  // Saved Exterior State
  const savedExteriorPos = useRef(new Vector3().copy(defaultPos));
  const savedExteriorTarget = useRef(new Vector3().copy(defaultTarget));

  // Interior Navigation State
  const isInteriorTransitioning = useRef(false);
  const interiorTargetPos = useRef(new Vector3());
  const interiorLookAt = useRef(new Vector3());

  // Handle Mode Switching Camera Logic
  useEffect(() => {
    const orb = controls as unknown as OrbitControlsImpl;
    if (!orb) return;

    if (showFloorplan) {
      // Switching TO Floorplan
      orb.target.set(0, 0, 0);
      orb.update();
      
    } else if (showInterior) {
      // Switching TO Interior
      // Saved exterior state handled by useFrame before transition
    } else {
      // Switching TO Exterior
      // Always reset to default position to ensure object is centered
      camera.position.copy(defaultPos);
      orb.target.copy(defaultTarget);
      
      if (camera instanceof PerspectiveCamera) {
          camera.fov = 22;
          camera.updateProjectionMatrix();
      }
      orb.update();
      isInteriorTransitioning.current = false;
    }
  }, [showFloorplan, showInterior, controls, camera]);

  // Handle Tab Change within Exterior Views (Size <-> Exterior <-> Summary)
  useEffect(() => {
    // If we are staying within exterior view but changing tabs, force reset
    if (targetView === 'exterior' && displayedView === 'exterior') {
      const orb = controls as unknown as OrbitControlsImpl;
      if (!orb) return;

      camera.position.copy(defaultPos);
      orb.target.copy(defaultTarget);
      
      if (camera instanceof PerspectiveCamera) {
          camera.fov = 22;
          camera.updateProjectionMatrix();
      }
      orb.update();
    }
  }, [activeTab, targetView, displayedView, controls, camera]);

  // Handle Interior Target Found / Changed
  useEffect(() => {
    if (showInterior && interiorTarget) {
      const orb = controls as unknown as OrbitControlsImpl;
      
      const worldPos = new Vector3();
      interiorTarget.getWorldPosition(worldPos);
      
      const quaternion = new Quaternion();
      interiorTarget.getWorldQuaternion(quaternion);
      const forward = new Vector3(0, 0, 1).applyQuaternion(quaternion);
      const targetCenter = worldPos.clone().add(forward.multiplyScalar(0.1));

      // Always ensure FOV is correct for interior
      if (camera instanceof PerspectiveCamera) {
        const currentFocalLength = camera.getFocalLength();
        if (Math.abs(currentFocalLength - 25) > 0.1) {
            camera.setFocalLength(25);
            camera.updateProjectionMatrix();
        }
      }

      if (isFading) {
        // Snap to position (Initial Load from Exterior)
        camera.position.copy(worldPos);
        orb.target.copy(targetCenter);
        orb.update();
        isInteriorTransitioning.current = false;
        
        // Reveal scene once target is ready and snapped
        setTimeout(() => setIsFading(false), 50);
      } else {
        // Smooth Transition (Navigation within Interior)
        interiorTargetPos.current.copy(worldPos);
        interiorLookAt.current.copy(targetCenter);
        isInteriorTransitioning.current = true;
      }
    }
  }, [showInterior, interiorTarget, isFading, controls, camera]);

  // Handle Reset Trigger
  useEffect(() => {
    if (resetTrigger && resetTrigger > 0 && showExterior) {
      const orb = controls as unknown as OrbitControlsImpl;

      camera.position.copy(defaultPos);
      orb.target.copy(defaultTarget);
      
      savedExteriorPos.current.copy(defaultPos);
      savedExteriorTarget.current.copy(defaultTarget);
      
      if (camera instanceof PerspectiveCamera) {
          camera.fov = 22;
          camera.updateProjectionMatrix();
      }
      orb.update();
    }
  }, [resetTrigger, showExterior, controls, camera]);

  useFrame((state, delta) => {
    const orb = controls as unknown as OrbitControlsImpl;
    if (!orb) return;

    // Handle Interior Smooth Transition
    if (showInterior && isInteriorTransitioning.current) {
        state.camera.position.lerp(interiorTargetPos.current, delta * 2.5);
        orb.target.lerp(interiorLookAt.current, delta * 2.5);
        orb.update();

        if (state.camera.position.distanceTo(interiorTargetPos.current) < 0.05) {
            isInteriorTransitioning.current = false;
        }
    }

    // Save exterior state when in Exterior view
    if (showExterior && orb.enabled && !isFading) {
        if (!isNaN(state.camera.position.x) && !isNaN(orb.target.x)) {
            savedExteriorPos.current.copy(state.camera.position);
            savedExteriorTarget.current.copy(orb.target);
        }
    }
  });

  return (
    <group dispose={null}>
      {/* Fade Transition Overlay */}
      <Html fullscreen style={{ pointerEvents: 'none', zIndex: 10 }}>
        <div 
          style={{ 
            width: '100%', 
            height: '100%', 
            backgroundColor: '#f0f0f0', 
            opacity: isFading ? 1 : 0, 
            transition: 'opacity 300ms ease-in-out' 
          }} 
        />
      </Html>

      {showExterior && <ExteriorModel config={config} />}
      
      {showFloorplan && (
        <>
            <FloorplanModel />
            <OrthographicCamera 
                makeDefault 
                position={[0, 50, 0]} 
                zoom={60} 
                near={0.1} 
                far={1000}
                onUpdate={c => c.lookAt(0, 0, 0)}
            />
        </>
      )}

      {showInterior && (
        <Suspense fallback={null}>
          <InteriorModel 
            activeWaypoint={activeWaypoint}
            onTargetFound={setInteriorTarget}
            onUserClick={(wp) => onWaypointChange && onWaypointChange(wp)}
          />
        </Suspense>
      )}
    </group>
  );
};

// Preload models
useGLTF.preload(EXTERIOR_URL);
useGLTF.preload(FLOORPLAN_URL);

export default ProductModel;
