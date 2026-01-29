
import { ConfigCategory, CategoryData } from './types';

export const CONFIG_DATA: CategoryData[] = [
  {
    id: ConfigCategory.SIZE,
    sections: [
      {
        title: 'Select Size',
        stateKey: 'size',
        multiSelect: false,
        options: [
          { 
            id: '23', 
            label: "23' Floorplan", 
            price: 89000, 
            description: 'Compact versatility for weekend warriors.',
            icon: 'https://www.dropbox.com/scl/fi/g80ebo1a2g1faftj4i8oe/23ext.webp?rlkey=hfl0bk3zam1o2o5hmmvywaly2&dl=1'
          },
          { 
            id: '25', 
            label: "25' Floorplan", 
            price: 98000, 
            description: 'The perfect balance of space and towability.',
            icon: 'https://www.dropbox.com/scl/fi/8xqrtaa4kaoypckyn5pol/27ext.png?rlkey=wlp1o0qz09mklh6i6hmtukh66&dl=1'
          },
          { 
            id: '27', 
            label: "27' Floorplan", 
            price: 109000, 
            description: 'Extended living space for long-haul adventures.',
            icon: 'https://www.dropbox.com/scl/fi/1ao0ei7erhm1iyj4j97b5/28ext.png?rlkey=t4lo8fie8t9vmp4dt1nngvy5h&dl=1'
          },
        ]
      }
    ]
  },
  {
    id: ConfigCategory.FLOORPLAN,
    sections: [
      {
        title: 'Select Floorplan',
        stateKey: 'floorplan',
        multiSelect: false,
        options: [
          { id: '23fb', label: 'Front Bed Queen', price: 0, description: 'Master suite in front, dining in rear.', availableForSize: ['23'] },
          { id: '23cb', label: 'Corner Bunk', price: 1500, description: 'Rear corner bed with overhead bunk.', availableForSize: ['23'] },
          { id: '23tb', label: 'Twin Bed', price: 500, description: 'Dual twin beds for flexible sleeping.', availableForSize: ['23'] },
          { id: '25fb', label: 'Front Bed Queen', price: 0, description: 'Spacious front bedroom with panoramic view.', availableForSize: ['25'] },
          { id: '25rb', label: 'Rear Bed Queen', price: 0, description: 'Bedroom tucked in the back for privacy.', availableForSize: ['25'] },
          { id: '25fb_twin', label: 'Front Bed Twin', price: 500, description: 'Open center aisle with twin beds.', availableForSize: ['25'] },
          { id: '27fb', label: 'Front Bed Queen', price: 0, description: 'Maximum master suite luxury.', availableForSize: ['27'] },
          { id: '27rb', label: 'Rear Bed Queen', price: 0, description: 'Secluded rear bedroom retreat.', availableForSize: ['27'] },
          { id: '27office', label: 'Home Office', price: 2500, description: 'Dedicated desk workspace with sleeping options.', availableForSize: ['27'] },
        ]
      }
    ]
  },
  {
    id: ConfigCategory.EXTERIOR,
    sections: [
      {
        title: 'Shell Finish',
        stateKey: 'material',
        multiSelect: false,
        options: [
          { 
            id: 'aluminum', 
            label: 'Classic Aluminum', 
            price: 0,
            colorCode: '#E0E0E0',
            icon: 'https://www.dropbox.com/scl/fi/efzaughr2p219kw9sv13e/Classic-Aluminium.webp?rlkey=2j6l24rvfv7igo4jr6gxguxod&dl=1',
            description: 'A professional, bright silver finish with a distinct horizontal brushed metal texture.'
          },
          { 
            id: 'matte_black', 
            label: 'Stealth Matte', 
            price: 3500,
            colorCode: '#222222',
            icon: 'https://www.dropbox.com/scl/fi/ionjxkl0gx4se9n3tw2w9/Stealth-Matte.webp?rlkey=piof69fli83680h7yj7rfjozn&dl=1',
            description: 'A deep, non-reflective obsidian black with a smooth, velvety surface.'
          },
          { 
            id: 'satin_white', 
            label: 'Arctic Satin', 
            price: 2000,
            colorCode: '#F5F5F5',
            icon: 'https://www.dropbox.com/scl/fi/sfbxeleq08pkmjaiv1p7m/Arctic-Satin.webp?rlkey=09acizvlhxm37xc98o1j1v8lm&dl=1',
            description: 'A clean, cool-toned frost silver with a sophisticated low-sheen finish.'
          },
          { 
            id: 'forest_green', 
            label: 'Ranger Green', 
            price: 2500,
            colorCode: '#2F4F2F',
            icon: 'https://www.dropbox.com/scl/fi/scmxoy52mcrhlovi9wog0/Ranger-Green.webp?rlkey=4aklplq5y1jpjmn2zn7c9k9t4&dl=1',
            description: 'A muted, earthy forest drab with a flat matte texture.'
          },
        ]
      }
    ]
  },
  {
    id: ConfigCategory.ADDONS,
    sections: [
      {
        title: 'Exterior Add-ons',
        stateKey: 'exterior',
        multiSelect: true,
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
        ]
      }
    ]
  },
  {
    id: ConfigCategory.INTERIOR,
    sections: [
      {
        title: 'Select Upholstery',
        stateKey: 'interior',
        multiSelect: false,
        options: [
          { id: 'coastal', label: 'Coastal Cove', price: 0, description: 'Light oaks, sea-mist fabrics, airy feel.' },
          { id: 'urban', label: 'Urban Loft', price: 1500, description: 'High-gloss cabinetry, dark accents, modern tech.' },
          { id: 'lodge', label: 'Mountain Lodge', price: 2500, description: 'Warm walnut, leather seating, cozy textiles.' },
        ]
      }
    ]
  },
  {
    id: ConfigCategory.CABINETS,
    sections: [
      {
        title: 'Select Cabinets',
        stateKey: 'cabinets',
        multiSelect: false,
        options: [
          { id: 'natural_oak', label: 'Natural Oak', price: 0, description: 'Light, organic wood finish.' },
          { id: 'walnut', label: 'Deep Walnut', price: 800, description: 'Rich, dark wood grain.' },
          { id: 'modern_gray', label: 'Modern Gray', price: 500, description: 'Sleek, painted minimalist finish.' },
        ]
      }
    ]
  },
  {
    id: ConfigCategory.SUMMARY,
    sections: []
  }
];

export const INITIAL_CONFIG: any = {
  size: '27',
  floorplan: '27fb',
  exterior: [],
  interior: ['coastal'],
  cabinets: 'natural_oak',
  material: 'aluminum',
};