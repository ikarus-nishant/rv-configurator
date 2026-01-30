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
  cabinets: string;
  material: 'aluminum' | 'red' | 'teal';
}

export interface ConfigOption {
  id: string;
  label: string;
  price?: number;
  description?: string;
  colorCode?: string; // For materials
  icon?: string; // URL for option image
  modelUrl?: string; // URL for specific 3D model part (e.g. cabinets)
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

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      primitive: any;
      sphereGeometry: any;
      meshBasicMaterial: any;
      meshStandardMaterial: any;
      boxGeometry: any;
      ambientLight: any;
      spotLight: any;
      pointLight: any;
      directionalLight: any;
      orthographicCamera: any;
      perspectiveCamera: any;
      'model-viewer': any;
    }
  }
}