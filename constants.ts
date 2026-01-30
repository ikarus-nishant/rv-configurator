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
            icon: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/icons/23ext.webp'
          },
          { 
            id: '25', 
            label: "25' Floorplan", 
            price: 98000, 
            description: 'The perfect balance of space and towability.',
            icon: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/icons/27ext.png'
          },
          { 
            id: '27', 
            label: "27' Floorplan", 
            price: 109000, 
            description: 'Extended living space for long-haul adventures.',
            icon: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/icons/28ext.png'
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
          { 
            id: '23fb', 
            label: '7749', 
            price: 0, 
            description: 'Master suite in front, dining in rear.', 
            availableForSize: ['23'],
            icon: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/icons/7749.webp',
            modelUrl: 'https://dl.dropbox.com/scl/fi/yn7crt148zi6c3ahpdi8g/fp-left.glb?rlkey=9cgs7g8t8e74j7b40frp4euc2&dl=1'
          },
          { 
            id: '23cb', 
            label: '8864', 
            price: 1500, 
            description: 'Rear corner bed with overhead bunk.', 
            availableForSize: ['23'],
            icon: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/icons/8864.webp',
            modelUrl: 'https://dl.dropbox.com/scl/fi/wyj68k36zs3s2v5nfrq0n/fp-right.glb?rlkey=cj0cs6fjxim58w3j5s0eg17ov&dl=1'
          },
          { 
            id: '25fb', 
            label: '7749', 
            price: 0, 
            description: 'Spacious front bedroom with panoramic view.', 
            availableForSize: ['25'],
            icon: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/icons/7749.webp',
            modelUrl: 'https://dl.dropbox.com/scl/fi/yn7crt148zi6c3ahpdi8g/fp-left.glb?rlkey=9cgs7g8t8e74j7b40frp4euc2&dl=1'
          },
          { 
            id: '25rb', 
            label: '8864', 
            price: 0, 
            description: 'Bedroom tucked in the back for privacy.', 
            availableForSize: ['25'],
            icon: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/icons/8864.webp',
            modelUrl: 'https://dl.dropbox.com/scl/fi/wyj68k36zs3s2v5nfrq0n/fp-right.glb?rlkey=cj0cs6fjxim58w3j5s0eg17ov&dl=1'
          },
          { 
            id: '27fb', 
            label: '7749', 
            price: 0, 
            description: 'Maximum master suite luxury.', 
            availableForSize: ['27'],
            icon: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/icons/7749.webp',
            modelUrl: 'https://dl.dropbox.com/scl/fi/yn7crt148zi6c3ahpdi8g/fp-left.glb?rlkey=9cgs7g8t8e74j7b40frp4euc2&dl=1'
          },
          { 
            id: '27rb', 
            label: '8864', 
            price: 0, 
            description: 'Secluded rear bedroom retreat.', 
            availableForSize: ['27'],
            icon: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/icons/8864.webp',
            modelUrl: 'https://dl.dropbox.com/scl/fi/wyj68k36zs3s2v5nfrq0n/fp-right.glb?rlkey=cj0cs6fjxim58w3j5s0eg17ov&dl=1'
          },
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
            icon: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/shell-finishes/Classic%20Aluminium.webp',
            description: 'A professional, bright silver finish with a distinct horizontal brushed metal texture.',
            modelUrl: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/3d-assets/ext-alu.glb'
          },
          { 
            id: 'red', 
            label: 'Sunset Red', 
            price: 3500,
            colorCode: '#8B0000',
            icon: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/shell-finishes/sunset%20red.webp',
            description: 'A bold, adventurous deep red matte finish.',
            modelUrl: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/3d-assets/ext-red.glb'
          },
          { 
            id: 'teal', 
            label: 'Coastal Teal', 
            price: 2000,
            colorCode: '#008080',
            icon: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/shell-finishes/teal.webp',
            description: 'A calming, sea-inspired satin teal finish.',
            modelUrl: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/3d-assets/ext-teal.glb'
          },
        ]
      },
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
            icon: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/add-ons/Solar%20Grid.webp'
          },
          { 
            id: 'awning', 
            label: 'Power Awning', 
            price: 3500, 
            description: 'Full-length patio coverage with LED lighting.',
            icon: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/add-ons/Power%20Awning.webp'
          },
          { 
            id: 'rack', 
            label: 'Gear Rack System', 
            price: 1200, 
            description: 'Rear mount for bikes and kayaks.',
            icon: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/add-ons/Gear%20Rack.webp'
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
          { 
            id: 'pebble', 
            label: 'Pebble Grey', 
            price: 0, 
            description: 'Soft, neutral grey fabrics for a modern, airy feel.',
            icon: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/uph-finishes/Pebble.jpg',
            modelUrl: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/3d-assets/uph-pebble.glb'
          },
          { 
            id: 'ivory', 
            label: 'Ivory Cream', 
            price: 1500, 
            description: 'Luxurious cream textiles for a bright, elegant interior.',
            icon: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/uph-finishes/Ivory.jpg',
            modelUrl: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/3d-assets/uph-ivory.glb'
          },
          { 
            id: 'blossom', 
            label: 'Cherry Blossom', 
            price: 2500, 
            description: 'Warm, inviting pink tones for a unique, cozy atmosphere.',
            icon: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/uph-finishes/Blossom.png',
            modelUrl: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/3d-assets/uph-blossom.glb'
          },
        ]
      },
      {
        title: 'Select Cabinets',
        stateKey: 'cabinets',
        multiSelect: false,
        options: [
          { 
            id: 'natural_oak', 
            label: 'Natural Oak', 
            price: 0, 
            description: 'Light, organic wood finish.',
            icon: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/wood-finishes/Oak.jpg',
            modelUrl: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/3d-assets/int-wood-oak.glb'
          },
          { 
            id: 'walnut', 
            label: 'Deep Walnut', 
            price: 800, 
            description: 'Rich, dark wood grain.',
            icon: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/wood-finishes/Walnut.jpg',
            modelUrl: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/3d-assets/int-wood-walnut.glb'
          },
          { 
            id: 'modern_gray', 
            label: 'Modern Gray', 
            price: 500, 
            description: 'Sleek, painted minimalist finish.',
            icon: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/wood-finishes/Modern%20Grey.jpg',
            modelUrl: 'https://gxgxlnorfuqagpfcbrsm.supabase.co/storage/v1/object/public/demo-assets/3d-assets/int-wood-grey.glb'
          },
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
  interior: ['pebble'],
  cabinets: 'natural_oak',
  material: 'aluminum',
};