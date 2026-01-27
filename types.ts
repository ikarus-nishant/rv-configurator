export enum ConfigCategory {
  SIZE = 'Model',
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