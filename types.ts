export enum ConfigCategory {
  SIZE = 'Model & Length',
  EXTERIOR = 'Exterior Packages',
  INTERIOR = 'Interior Decor',
  MATERIAL = 'Shell Finish'
}

export interface ProductConfig {
  size: 'bambi' | 'caravel' | 'globetrotter';
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
}

export interface CategoryData {
  id: ConfigCategory;
  options: ConfigOption[];
  multiSelect?: boolean;
}