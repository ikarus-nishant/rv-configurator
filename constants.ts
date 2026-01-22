import { ConfigCategory, CategoryData } from './types';

export const CONFIG_DATA: CategoryData[] = [
  {
    id: ConfigCategory.SIZE,
    options: [
      { id: 'bambi', label: '16\' Bambi', price: 59000, description: 'Lightweight, single-axle compact efficiency.' },
      { id: 'caravel', label: '22\' Caravel', price: 74000, description: 'Dedicated sleeping space with panoramic windows.' },
      { id: 'globetrotter', label: '27\' Globetrotter', price: 109000, description: 'The ultimate luxury touring flagship.' },
    ],
    multiSelect: false,
  },
  {
    id: ConfigCategory.EXTERIOR,
    options: [
      { 
        id: 'solar', 
        label: 'Off-Grid Solar', 
        price: 2500, 
        description: '300W Roof panels + Lithium battery bank.',
        icon: 'https://www.dropbox.com/scl/fi/x1o4nnfxd24j41rfpvhhp/Solar-Grid.webp?rlkey=jq9muuf7tr1zpotpj5tq5oe6q&dl=1'
      },
      { 
        id: 'awning', 
        label: 'Power Awning', 
        price: 3500, 
        description: 'Full-length patio coverage with LED lighting.',
        icon: 'https://www.dropbox.com/scl/fi/gq0jes2mh9ggen9mnb6i8/Power-Awning.webp?rlkey=e980d2axnsucu0gwdqe81hkpf&dl=1'
      },
      { 
        id: 'rack', 
        label: 'Gear Rack System', 
        price: 1200, 
        description: 'Rear mount for bikes and kayaks.',
        icon: 'https://www.dropbox.com/scl/fi/bowsbporgsjni56rutasq/Gear-Rack.webp?rlkey=wfyr8mnc2t4h2sabcp3cr2u4b&dl=1'
      },
    ],
    multiSelect: true,
  },
  {
    id: ConfigCategory.INTERIOR,
    options: [
      { id: 'coastal', label: 'Coastal Cove', price: 0, description: 'Light oaks, sea-mist fabrics, airy feel.' },
      { id: 'urban', label: 'Urban Loft', price: 1500, description: 'High-gloss cabinetry, dark accents, modern tech.' },
      { id: 'lodge', label: 'Mountain Lodge', price: 2500, description: 'Warm walnut, leather seating, cozy textiles.' },
    ],
    multiSelect: false, // Changed to false for decor themes
  },
  {
    id: ConfigCategory.MATERIAL,
    options: [
      { 
        id: 'aluminum', 
        label: 'Classic Aluminum', 
        colorCode: '#E0E0E0',
        icon: 'https://www.dropbox.com/scl/fi/efzaughr2p219kw9sv13e/Classic-Aluminium.webp?rlkey=2j6l24rvfv7igo4jr6gxguxod&dl=1',
        description: 'A professional, bright silver finish with a distinct horizontal brushed metal texture and soft light reflections.'
      },
      { 
        id: 'matte_black', 
        label: 'Stealth Matte', 
        colorCode: '#222222',
        icon: 'https://www.dropbox.com/scl/fi/ionjxkl0gx4se9n3tw2w9/Stealth-Matte.webp?rlkey=piof69fli83680h7yj7rfjozn&dl=1',
        description: 'A deep, non-reflective obsidian black with a smooth, velvety surface that absorbs light for a tactical appearance.'
      },
      { 
        id: 'satin_white', 
        label: 'Arctic Satin', 
        colorCode: '#F5F5F5',
        icon: 'https://www.dropbox.com/scl/fi/sfbxeleq08pkmjaiv1p7m/Arctic-Satin.webp?rlkey=09acizvlhxm37xc98o1j1v8lm&dl=1',
        description: 'A clean, cool-toned frost silver with a sophisticated low-sheen finish and smooth gradient highlights.'
      },
      { 
        id: 'forest_green', 
        label: 'Ranger Green', 
        colorCode: '#2F4F2F',
        icon: 'https://www.dropbox.com/scl/fi/scmxoy52mcrhlovi9wog0/Ranger-Green.webp?rlkey=4aklplq5y1jpjmn2zn7c9k9t4&dl=1',
        description: 'A muted, earthy forest drab with a flat matte texture, designed for a rugged and utilitarian aesthetic.'
      },
    ],
    multiSelect: false,
  },
];

export const INITIAL_CONFIG: any = {
  size: 'globetrotter',
  exterior: [],
  interior: ['coastal'],
  material: 'aluminum',
};