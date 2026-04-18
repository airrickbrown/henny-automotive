import type { Part } from '../types/part'

export const parts: Part[] = [
  {
    id: '1',
    slug: 'v8-engine-2018-mustang',
    name: 'V8 Engine for 2018 Mustang',
    category: 'ENGINES',
    description: 'Complete swap-ready 5.0L Coyote V8 block with full ancillaries. Tested and certified.',
    image: '/images/parts/v8-mustang-engine.jpg',
    status: 'HOT PICK',
    compatibleMakes: ['Ford'],
    whatsappMessage:
      "Hi Henny Automotive, I'm interested in the V8 Engine for 2018 Mustang (5.0L Coyote). Please send availability and pricing details.",
  },
  {
    id: '2',
    slug: 'bespoke-21-forged-alloy-set',
    name: 'Bespoke 21" Forged Alloy Set',
    category: 'WHEELS',
    description: 'Lightweight forged aluminium, 5x112 PCD. Fits most German-spec SUVs and sedans.',
    image: '/images/parts/forged-alloy-wheels.jpg',
    status: null,
    compatibleMakes: ['BMW', 'Mercedes-Benz', 'Audi', 'Porsche'],
    whatsappMessage:
      "Hi Henny Automotive, I'm interested in the Bespoke 21\" Forged Alloy Set. Please send fitment details and pricing.",
  },
  {
    id: '3',
    slug: 'carbon-fiber-hi-sport-wheel',
    name: 'Carbon Fiber Hi-Sport Wheel',
    category: 'WHEELS',
    description: 'Full carbon fibre construction. 20" diameter. Track-spec weight reduction.',
    image: '/images/parts/carbon-fiber-wheel.jpg',
    status: 'LIMITED',
    compatibleMakes: ['Porsche', 'BMW', 'Ferrari'],
    whatsappMessage:
      "Hi Henny Automotive, I'm interested in the Carbon Fiber Hi-Sport Wheel. Please confirm availability and pricing.",
  },
  {
    id: '4',
    slug: 'brembo-6-piston-brake-kit',
    name: 'Brembo 6-Piston Brake Kit',
    category: 'BRAKES',
    description: 'Front 6-piston caliper kit with 380mm slotted discs. Direct OEM bolt-on fitment.',
    image: '/images/parts/brembo-brake-kit.jpg',
    status: null,
    compatibleMakes: ['BMW', 'Mercedes-Benz', 'Audi'],
    whatsappMessage:
      "Hi Henny Automotive, I'm interested in the Brembo 6-Piston Brake Kit. Please send compatibility and pricing details.",
  },
  {
    id: '5',
    slug: 'titanium-variable-valve-set',
    name: 'Titanium Variable Valve Set',
    category: 'EXHAUST',
    description: 'Full titanium cat-back exhaust with electronic valve control. Weight saving: 8kg.',
    image: '/images/parts/titanium-exhaust.jpg',
    status: null,
    compatibleMakes: ['BMW', 'Porsche', 'Audi'],
    whatsappMessage:
      "Hi Henny Automotive, I'm interested in the Titanium Variable Valve Exhaust Set. Please send fitment and pricing details.",
  },
  {
    id: '6',
    slug: 'matrix-led-conversion-kit',
    name: 'Matrix LED Conversion Kit',
    category: 'INTERIOR',
    description: 'Full adaptive matrix LED headlight retrofit. Includes control module and harness.',
    image: '/images/parts/matrix-led-kit.jpg',
    status: 'HOT PICK',
    compatibleMakes: ['Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen'],
    whatsappMessage:
      "Hi Henny Automotive, I'm interested in the Matrix LED Conversion Kit. Please confirm compatibility with my vehicle and send pricing.",
  },
]
