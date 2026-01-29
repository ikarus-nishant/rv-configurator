import React, { useEffect, useRef, useState, Suspense, useMemo } from 'react';
import { useGLTF, Html, OrthographicCamera } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { Mesh, Vector3, Object3D, PerspectiveCamera, Quaternion, Group } from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { ProductConfig, ConfigCategory } from '../types';
import { CONFIG_DATA } from '../constants';

// Ensure all R3F elements used are defined in JSX.IntrinsicElements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      primitive: any;
      mesh: any;
      sphereGeometry: any;
      meshBasicMaterial: any;
      ambientLight: any;
      spotLight: any;
      'model-viewer': any;
    }
  }
}

interface ProductModelProps {
  config: ProductConfig;
  activeTab?: ConfigCategory;
  resetTrigger?: number;
  activeWaypoint?: string;
  onWaypointChange?: (waypoint: string) => void;
  onTransitionStateChange?: (isTransitioning: boolean) => void;
}

const EXTERIOR_URL = 'https://dl.dropbox.com/scl/fi/n893bek5wluovtcl5qtpj/ext.glb?rlkey=9n026wssl8o6kf6sp4iix4lfd&dl=1';
const INTERIOR_URL = 'https://dl.dropbox.com/scl/fi/u2jgaow3rbixi8q6lnufr/int.glb?rlkey=eidbdbto55qmngvzs9xnk4p5j&dl=1';
const FLOORPLAN_URL = 'https://dl.dropbox.com/scl/fi/yn7crt148zi6c3ahpdi8g/fp.glb?rlkey=9cgs7g8t8e74j7b40frp4euc2&dl=1';

const ExteriorModel: React.FC<{ config: ProductConfig }> = ({ config }) => {
  const { scene } = useGLTF(EXTERIOR_URL);

  useEffect(() => {
    const materialSection = CONFIG_DATA.find(c => c.id === ConfigCategory.EXTERIOR)
      ?.sections.find(s => s.stateKey === 'material');
    const selectedOption = materialSection?.options.find(o => o.id === config.material);
    const targetColor = selectedOption?.colorCode || '#E0E0E0';

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

interface HotspotProps {
  position: Vector3;
  isActive: boolean;
  onClick: () => void;
}

const Hotspot: React.FC<HotspotProps> = ({ position, isActive, onClick }) => {
  const [hovered, setHovered] = useState(false);
  
  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: any) => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <group 
      position={position} 
      onClick={(e) => { e.stopPropagation(); onClick(); }} 
      onPointerOver={handlePointerOver} 
      onPointerOut={handlePointerOut}
      renderOrder={100}
    >
      <mesh>
        <sphereGeometry args={[0.04, 32, 32]} />
        <meshBasicMaterial 
            color={isActive || hovered ? "#ba3b32" : "#ffffff"} 
            toneMapped={false} 
            depthTest={false} 
            transparent
        />
      </mesh>
      
      <mesh>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshBasicMaterial 
            color={isActive || hovered ? "#ba3b32" : "#ffffff"} 
            transparent 
            opacity={0.3} 
            toneMapped={false} 
            depthTest={false}
        />
      </mesh>
    </group>
  );
};

interface InteriorModelProps {
  activeWaypoint: string;
  onTargetFound: (target: Object3D) => void;
  onUserClick: (waypoint: string) => void;
}

const InteriorModel: React.FC<InteriorModelProps> = ({ activeWaypoint, onTargetFound, onUserClick }) => {
  const { scene } = useGLTF(INTERIOR_URL);
  const [waypoints, setWaypoints] = useState<{name: string, position: Vector3}[]>([]);

  useEffect(() => {
    const foundWaypoints: {name: string, position: Vector3}[] = [];
    scene.updateMatrixWorld(true);

    scene.traverse((child) => {
      if (child.name.includes('Plane')) {
        child.visible = false;
      }
      if (child.name.includes('Waypoint')) {
        const pos = new Vector3();
        child.getWorldPosition(pos);
        foundWaypoints.push({ name: child.name, position: pos });
      }
    });
    foundWaypoints.sort((a, b) => a.name.localeCompare(b.name));
    setWaypoints(foundWaypoints);
  }, [scene]);

  useEffect(() => {
    const target = scene.getObjectByName(activeWaypoint);
    if (target) {
      onTargetFound(target);
    }
  }, [scene, activeWaypoint, onTargetFound]);

  return (
    <group>
      <primitive object={scene} />
      {waypoints.map((wp) => (
        <Hotspot 
          key={wp.name}
          position={wp.position}
          isActive={activeWaypoint === wp.name}
          onClick={() => onUserClick(wp.name)}
        />
      ))}
    </group>
  );
};

const ProductModel: React.FC<ProductModelProps> = ({ config, activeTab, resetTrigger, activeWaypoint = 'Waypoint1', onWaypointChange, onTransitionStateChange }) => {
  const { camera, controls } = useThree();
  const [interiorTarget, setInteriorTarget] = useState<Object3D | null>(null);
  
  let targetView: 'exterior' | 'interior' | 'floorplan' = 'exterior';
  if (activeTab === ConfigCategory.INTERIOR) targetView = 'interior';
  else if (activeTab === ConfigCategory.FLOORPLAN) targetView = 'floorplan';

  const [displayedView, setDisplayedView] = useState<'exterior' | 'interior' | 'floorplan'>(targetView);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (targetView !== displayedView) {
      // Start transition immediately
      setIsFading(true);
      onTransitionStateChange?.(true);
      
      const fadeDuration = 200; // Snappier fade
      
      const t1 = setTimeout(() => {
        setDisplayedView(targetView);
        
        if (targetView === 'exterior' || targetView === 'floorplan') {
          const t2 = setTimeout(() => {
            setIsFading(false);
            onTransitionStateChange?.(false);
          }, 50);
          return () => clearTimeout(t2);
        }
      }, fadeDuration);

      return () => clearTimeout(t1);
    }
  }, [targetView, displayedView, onTransitionStateChange]);

  const showInterior = displayedView === 'interior';
  const showFloorplan = displayedView === 'floorplan';
  const showExterior = displayedView === 'exterior';

  const defaultPos = new Vector3(0, 3, 16);
  const defaultTarget = new Vector3(0, 1, 0);

  const savedExteriorPos = useRef(new Vector3().copy(defaultPos));
  const savedExteriorTarget = useRef(new Vector3().copy(defaultTarget));

  const isInteriorTransitioning = useRef(false);
  const interiorTargetPos = useRef(new Vector3());
  const interiorLookAt = useRef(new Vector3());

  useEffect(() => {
    const orb = controls as unknown as OrbitControlsImpl;
    if (!orb) return;

    if (showFloorplan) {
      orb.target.set(0, 0, 0);
      orb.update();
    } else if (showInterior) {
      // Interior logic handled by interiorTarget effect
    } else {
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

  useEffect(() => {
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

  useEffect(() => {
    if (showInterior && interiorTarget) {
      const orb = controls as unknown as OrbitControlsImpl;
      const worldPos = new Vector3();
      interiorTarget.getWorldPosition(worldPos);
      const quaternion = new Quaternion();
      interiorTarget.getWorldQuaternion(quaternion);
      const forward = new Vector3(0, 0, 1).applyQuaternion(quaternion);
      const targetCenter = worldPos.clone().add(forward.multiplyScalar(0.1));

      if (camera instanceof PerspectiveCamera) {
        camera.setFocalLength(25);
        camera.updateProjectionMatrix();
      }

      if (isFading) {
        camera.position.copy(worldPos);
        orb.target.copy(targetCenter);
        orb.update();
        isInteriorTransitioning.current = false;
        
        setTimeout(() => {
          setIsFading(false);
          onTransitionStateChange?.(false);
        }, 50);
      } else {
        interiorTargetPos.current.copy(worldPos);
        interiorLookAt.current.copy(targetCenter);
        isInteriorTransitioning.current = true;
      }
    }
  }, [showInterior, interiorTarget, isFading, controls, camera, onTransitionStateChange]);

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

    if (showInterior && isInteriorTransitioning.current) {
        state.camera.position.lerp(interiorTargetPos.current, delta * 3.5);
        orb.target.lerp(interiorLookAt.current, delta * 3.5);
        orb.update();
        if (state.camera.position.distanceTo(interiorTargetPos.current) < 0.01) {
            isInteriorTransitioning.current = false;
        }
    }

    if (showExterior && orb.enabled && !isFading) {
        if (!isNaN(state.camera.position.x) && !isNaN(orb.target.x)) {
            savedExteriorPos.current.copy(state.camera.position);
            savedExteriorTarget.current.copy(orb.target);
        }
    }
  });

  return (
    <group dispose={null}>
      <Html fullscreen style={{ pointerEvents: 'none', zIndex: 10 }}>
        <div 
          style={{ 
            width: '100%', 
            height: '100%', 
            backgroundColor: '#f0f0f0', 
            opacity: isFading ? 1 : 0, 
            transition: 'opacity 200ms ease-in-out' 
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
useGLTF.preload(INTERIOR_URL);

export default ProductModel;