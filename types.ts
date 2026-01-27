import React from 'react';

export enum ConfigCategory {
  SIZE = 'Size',
  FLOORPLAN = 'Floorplan',
  EXTERIOR = 'Exterior',
  INTERIOR = 'Interior',
  SUMMARY = 'Summary'
}

export interface ProductConfig {
  size: '23' | '25' | '27';
  floorplan: string;
  exterior: string[];
  interior: string[];
  material: 'aluminum' | 'matte_black' | 'satin_white' | 'forest_green';
}

export interface ConfigOption {
  id: string;
  label: string;
  price?: number;
  description?: string;
  colorCode?: string; // For materials
  icon?: string; // URL for option image
  availableForSize?: string[]; // Dependencies: only show this option if config.size matches one of these
}

export interface ConfigSection {
  title?: string;
  multiSelect: boolean;
  stateKey: keyof ProductConfig;
  options: ConfigOption[];
}

export interface CategoryData {
  id: ConfigCategory;
  sections: ConfigSection[];
}

// Augment JSX namespace to include R3F elements and custom elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Three.js elements
      group: any;
      primitive: any;
      ambientLight: any;
      spotLight: any;
      mesh: any;
      sphereGeometry: any;
      meshBasicMaterial: any;
      
      // Custom Web Components
      'model-viewer': any;
    }
  }
}

// Additional augmentation for React.JSX namespace which is required by some TypeScript configurations
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      primitive: any;
      ambientLight: any;
      spotLight: any;
      mesh: any;
      sphereGeometry: any;
      meshBasicMaterial: any;
      'model-viewer': any;
    }
  }
}
