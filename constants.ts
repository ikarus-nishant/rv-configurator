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
            modelUrl: 'https://dl.dropbox.com/scl/fi/yn7crt148zi6c3ahpdi8g/fp-left.glb?rlkey=9cgs7g8t8e74j7b40frp4euc2&dl=1'
          },
          { 
            id: '23cb', 
            label: '8864', 
            price: 1500, 
            description: 'Rear corner bed with overhead bunk.', 
            availableForSize: ['23'],
            modelUrl: 'https://dl.dropbox.com/scl/fi/wyj68k36zs3s2v5nfrq0n/fp-right.glb?rlkey=cj0cs6fjxim58w3j5s0eg17ov&dl=1'
          },
          { 
            id: '25fb', 
            label: '7749', 
            price: 0, 
            description: 'Spacious front bedroom with panoramic view.', 
            availableForSize: ['25'],
            modelUrl: 'https://dl.dropbox.com/scl/fi/yn7crt148zi6c3ahpdi8g/fp-left.glb?rlkey=9cgs7g8t8e74j7b40frp4euc2&dl=1'
          },
          { 
            id: '25rb', 
            label: '8864', 
            price: 0, 
            description: 'Bedroom tucked in the back for privacy.', 
            availableForSize: ['25'],
            modelUrl: 'https://dl.dropbox.com/scl/fi/wyj68k36zs3s2v5nfrq0n/fp-right.glb?rlkey=cj0cs6fjxim58w3j5s0eg17ov&dl=1'
          },
          { 
            id: '27fb', 
            label: '7749', 
            price: 0, 
            description: 'Maximum master suite luxury.', 
            availableForSize: ['27'],
            modelUrl: 'https://dl.dropbox.com/scl/fi/yn7crt148zi6c3ahpdi8g/fp-left.glb?rlkey=9cgs7g8t8e74j7b40frp4euc2&dl=1'
          },
          { 
            id: '27rb', 
            label: '8864', 
            price: 0, 
            description: 'Secluded rear bedroom retreat.', 
            availableForSize: ['27'],
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
            icon: 'https://www.dropbox.com/scl/fi/efzaughr2p219kw9sv13e/Classic-Aluminium.webp?rlkey=2j6l24rvfv7igo4jr6gxguxod&dl=1',
            description: 'A professional, bright silver finish with a distinct horizontal brushed metal texture.',
            modelUrl: 'https://dl.dropbox.com/scl/fi/9whp0impipzolgirc4z5r/ext-alu.glb?rlkey=7rjgvd2lh1vdpziew4nocw5lb&dl=1'
          },
          { 
            id: 'red', 
            label: 'Sunset Red', 
            price: 3500,
            colorCode: '#8B0000',
            description: 'A bold, adventurous deep red matte finish.',
            modelUrl: 'https://dl.dropbox.com/scl/fi/xykyfx86efwxb6821dd44/ext-red.glb?rlkey=day54kc3g371iq7kmqb1zxg1r&dl=1'
          },
          { 
            id: 'teal', 
            label: 'Coastal Teal', 
            price: 2000,
            colorCode: '#008080',
            description: 'A calming, sea-inspired satin teal finish.',
            modelUrl: 'https://dl.dropbox.com/scl/fi/4honghp9ii4a6t3c129fd/ext-teal.glb?rlkey=qplf4mti2t3busb4hx0zr8hbu&dl=1'
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
          { 
            id: 'pebble', 
            label: 'Pebble Grey', 
            price: 0, 
            description: 'Soft, neutral grey fabrics for a modern, airy feel.',
            icon: 'https://dl.dropbox.com/scl/fi/1z3bw5cjqrz2bi7318rf9/Pebble.jpg?rlkey=hgtgual1ajksajhwnvrv8uogt&dl=1',
            modelUrl: 'https://dl.dropbox.com/scl/fi/0gmudfs0k6jas3e30wdaz/uph-pebble.glb?rlkey=ue0goy58gjl0w2sh3g2itbhfh&dl=1'
          },
          { 
            id: 'ivory', 
            label: 'Ivory Cream', 
            price: 1500, 
            description: 'Luxurious cream textiles for a bright, elegant interior.',
            icon: 'https://dl.dropbox.com/scl/fi/01z3oxfgge4i3tk6jqd5r/Ivory.jpg?rlkey=vnqgh6r6odcju4255r3v7mbsa&dl=1',
            modelUrl: 'https://dl.dropbox.com/scl/fi/ez2y89quhjpo5evj8luht/uph-ivory.glb?rlkey=y0zydti6zgcpftqryw7pe2dmm&dl=1'
          },
          { 
            id: 'blossom', 
            label: 'Cherry Blossom', 
            price: 2500, 
            description: 'Warm, inviting pink tones for a unique, cozy atmosphere.',
            icon: 'https://dl.dropbox.com/scl/fi/cnis9s2cbpk1zut2rosvq/Blossom.png?rlkey=i85mim45edeyzi8hkquc8puq3&dl=1',
            modelUrl: 'https://dl.dropbox.com/scl/fi/bc6zg73z39r24vrir3ju2/uph-blossom.glb?rlkey=zash8mbejya09i6np8647ci18&dl=1'
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
            icon: 'https://dl.dropbox.com/scl/fi/cvfjbnc1aseiyax7wfp4h/Oak.jpg?rlkey=xxsgslx6fphukwwt4tt9bropb&dl=1',
            modelUrl: 'https://dl.dropbox.com/scl/fi/12xpge7rvarwykcdvujvn/int-wood-oak.glb?rlkey=j0i7ek23boootva7ep3oewdqc&dl=1'
          },
          { 
            id: 'walnut', 
            label: 'Deep Walnut', 
            price: 800, 
            description: 'Rich, dark wood grain.',
            icon: 'https://dl.dropbox.com/scl/fi/8gipxmldaw1hapg1mq7vk/Walnut.jpg?rlkey=ca6d0gp3lskydr4delhq0cb4t&dl=1',
            modelUrl: 'https://dl.dropbox.com/scl/fi/qv2ftzf2qr63dn7e8gkco/int-wood-walnut.glb?rlkey=z7aayr5fgoy4xhuez5zzm2qpu&dl=1'
          },
          { 
            id: 'modern_gray', 
            label: 'Modern Gray', 
            price: 500, 
            description: 'Sleek, painted minimalist finish.',
            icon: 'https://dl.dropbox.com/scl/fi/op9i56x61tz6vtf2uoooq/Modern-Grey.jpg?rlkey=dz0pc51x1i19itam3oq9812k5&dl=1',
            modelUrl: 'https://dl.dropbox.com/scl/fi/7dlfl1ezuoqofjl5czoqj/int-wood-grey.glb?rlkey=c1amt3s2wpbgux6gbqvlofrry&dl=1'
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