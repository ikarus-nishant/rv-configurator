import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { ProductConfig, ConfigCategory } from '../types';
import { CONFIG_DATA } from '../constants';

interface ProductModelProps {
  config: ProductConfig;
  activeTab?: ConfigCategory;
  resetTrigger?: number;
}

const ProductModel: React.FC<ProductModelProps> = ({ config, activeTab, resetTrigger }) => {
  // Load the GLB model
  const { scene } = useGLTF('https://dl.dropbox.com/scl/fi/r6lh11ifdqa42wx38vsad/Airstream-27.glb?rlkey=yfpzeiaksppbw9azf6etyj2th&dl=1');
  const { camera, controls } = useThree();
  
  // -- References for Logic --
  const interiorTargetRef = useRef<THREE.Object3D | null>(null);
  const previousTab = useRef<ConfigCategory | undefined>(activeTab);
  
  // -- Animation State --
  const isTransitioning = useRef(false);
  
  // Default Camera Position (Straight Front View)
  // X=0 to face straight, Positive Z for front view
  const defaultPos = new THREE.Vector3(0, 3, 16);
  const defaultTarget = new THREE.Vector3(0, 1, 0);

  // Target values for the animation to seek towards
  const targetPos = useRef(new THREE.Vector3().copy(defaultPos));
  const targetLookAt = useRef(new THREE.Vector3().copy(defaultTarget));
  const targetFov = useRef(22);
  
  // Saved state to restore when leaving interior view
  const savedExteriorPos = useRef(new THREE.Vector3().copy(defaultPos));
  const savedExteriorTarget = useRef(new THREE.Vector3().copy(defaultTarget));

  // 1. Locate the Interior Camera Target Node in the GLB
  useEffect(() => {
    const target = scene.getObjectByName('InteriorNull');
    if (target) {
      interiorTargetRef.current = target;
    } else {
      console.warn("Could not find node named 'InteriorNull' in GLB");
    }
  }, [scene]);

  // 2. Handle Material Changes and Exterior Visibility
  useEffect(() => {
    const materialCategory = CONFIG_DATA.find(c => c.id === ConfigCategory.MATERIAL);
    const selectedOption = materialCategory?.options.find(o => o.id === config.material);
    const targetColor = selectedOption?.colorCode || '#E0E0E0';

    const exteriorIds = CONFIG_DATA
      .find(c => c.id === ConfigCategory.EXTERIOR)
      ?.options.map(o => o.id) || [];

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const associatedOptionId = exteriorIds.find(id => 
          child.name.toLowerCase().includes(id.toLowerCase())
        );

        if (associatedOptionId) {
          child.visible = config.exterior.includes(associatedOptionId);
        }

        if (child.material && child.material.name === 'Steel') {
          child.material.color.set(targetColor);
          
          if (config.material === 'matte_black') {
            child.material.roughness = 0.9;
            child.material.metalness = 0.1;
          } else if (config.material === 'aluminum') {
            child.material.roughness = 0.3;
            child.material.metalness = 1.0;
          } else {
             child.material.roughness = 0.5;
             child.material.metalness = 0.5;
          }
        }
      }
    });
  }, [config, scene]);

  // 3. Robust Camera Transition Logic
  useEffect(() => {
    const orb = controls as unknown as OrbitControlsImpl;
    if (!orb) return;

    // A. Enter Interior Mode
    if (activeTab === ConfigCategory.INTERIOR) {
      if (interiorTargetRef.current) {
        // Save current exterior state before moving
        savedExteriorPos.current.copy(camera.position);
        savedExteriorTarget.current.copy(orb.target);

        // Calculate interior target position
        interiorTargetRef.current.getWorldPosition(targetPos.current);
        
        // Calculate look-at direction (slightly forward from the node)
        const quaternion = new THREE.Quaternion();
        interiorTargetRef.current.getWorldQuaternion(quaternion);
        const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(quaternion);
        targetLookAt.current.copy(targetPos.current).add(forward.multiplyScalar(0.1));

        // Start animation
        targetFov.current = 50;
        isTransitioning.current = true;
        orb.enabled = false; // Disable controls during flight
      }
    } 
    // B. Exit Interior Mode (Return to Exterior)
    else if (previousTab.current === ConfigCategory.INTERIOR) {
      // Restore the saved exterior state
      targetPos.current.copy(savedExteriorPos.current);
      targetLookAt.current.copy(savedExteriorTarget.current);
      
      // Start animation
      targetFov.current = 22;
      isTransitioning.current = true;
      orb.enabled = false;
    }
    // C. Switching between Exterior tabs (e.g. Size -> Material)
    // Do nothing. Camera stays where the user left it.

    previousTab.current = activeTab;
  }, [activeTab, camera, controls]);

  // 4. Handle Manual Reset Trigger
  useEffect(() => {
    if (resetTrigger && resetTrigger > 0) {
      if (activeTab !== ConfigCategory.INTERIOR) {
         // Reset to default exterior view
         targetPos.current.copy(defaultPos);
         targetLookAt.current.copy(defaultTarget);
      }
      
      // Re-trigger the transition to the current target
      isTransitioning.current = true;
      const orb = controls as unknown as OrbitControlsImpl;
      if (orb) orb.enabled = false;
    }
  }, [resetTrigger, controls, activeTab]);

  // 5. Animation Loop
  useFrame((state, delta) => {
    const orb = controls as unknown as OrbitControlsImpl;
    if (!orb) return;

    // Smooth FOV interpolation (Always active for lens breathing effect)
    const cam = state.camera as THREE.PerspectiveCamera;
    if (Math.abs(cam.fov - targetFov.current) > 0.1) {
      cam.fov = THREE.MathUtils.lerp(cam.fov, targetFov.current, delta * 3);
      cam.updateProjectionMatrix();
    }

    // Camera Movement Transition
    if (isTransitioning.current) {
      // Interpolate Position
      state.camera.position.lerp(targetPos.current, delta * 3);
      
      // Interpolate LookAt Target
      orb.target.lerp(targetLookAt.current, delta * 3);
      
      // REQUIRED: Update controls to sync the camera orientation with the new target
      orb.update();
      
      // Check if we have arrived
      const posDist = state.camera.position.distanceTo(targetPos.current);
      const targetDist = orb.target.distanceTo(targetLookAt.current);

      if (posDist < 0.05 && targetDist < 0.05) {
        isTransitioning.current = false;
        orb.enabled = true; // Re-enable user control
      }
    }
  });

  return (
    <group dispose={null}>
      <primitive object={scene} />
    </group>
  );
};

export default ProductModel;