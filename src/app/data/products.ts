export interface Product {
  id: number;
  name: string;
  category: 'vape' | 'eliquid' | 'bong' | 'accessory' | 'rollingpaper' | 'cigar';
  price: number;
  image: string;
  description: string;
}

export const PRODUCTS: Product[] = [
  // ========== VAPES ==========
  {
    id: 1,
    name: 'Disposable Vape – Mango Ice',
    category: 'vape',
    price: 2800,
    image: '/products/vape-mango.jpg',
    description: '5000 puffs • 5% nicotine • Sweet mango ice'
  },
  {
    id: 2,
    name: 'Disposable Vape – Blue Razz',
    category: 'vape',
    price: 3000,
    image: '/products/vape-blue-razz.jpg',
    description: '5000 puffs • Blue raspberry blast'
  },
  {
    id: 3,
    name: 'Disposable Vape – Watermelon',
    category: 'vape',
    price: 3000,
    image: '/products/vape-watermelon.jpg',
    description: '5000 puffs • Fresh watermelon flavour'
  },
  {
    id: 4,
    name: 'Disposable Vape – Grape Ice',
    category: 'vape',
    price: 2900,
    image: '/products/vape-grape.jpg',
    description: '6000 puffs • Cool grape ice'
  },
  {
    id: 5,
    name: 'Disposable Vape – Strawberry Banana',
    category: 'vape',
    price: 3000,
    image: '/products/vape-straw-banana.jpg',
    description: '5000 puffs • Sweet strawberry banana'
  },
  {
    id: 6,
    name: 'Pod Kit – Starter',
    category: 'vape',
    price: 8200,
    image: '/products/vape-pod-kit.jpg',
    description: 'Refillable pod system • USB-C charging'
  },

  // ========== E-LIQUIDS ==========
  {
    id: 7,
    name: 'E-Liquid – Strawberry Blast 50ml',
    category: 'eliquid',
    price: 2500,
    image: '/products/eliquid-strawberry.jpg',
    description: '70/30 VG/PG • 3mg nicotine'
  },
  {
    id: 8,
    name: 'E-Liquid – Mint Fresh 50ml',
    category: 'eliquid',
    price: 2200,
    image: '/products/eliquid-mint.jpg',
    description: 'Cool mint • 6mg nicotine'
  },
  {
    id: 9,
    name: 'E-Liquid – Tobacco Classic 50ml',
    category: 'eliquid',
    price: 2300,
    image: '/products/eliquid-tobacco.jpg',
    description: 'Classic tobacco taste • 6mg'
  },
  {
    id: 10,
    name: 'E-Liquid – Mango Tango 50ml',
    category: 'eliquid',
    price: 2500,
    image: '/products/eliquid-mango.jpg',
    description: 'Sweet mango • 3mg nicotine'
  },
  {
    id: 11,
    name: 'E-Liquid – Blueberry Ice 50ml',
    category: 'eliquid',
    price: 2400,
    image: '/products/eliquid-blueberry.jpg',
    description: 'Blueberry with menthol • 3mg'
  },
  {
    id: 12,
    name: 'Nic Salt – Strawberry 30ml',
    category: 'eliquid',
    price: 2000,
    image: '/products/eliquid-nicsalt.jpg',
    description: 'High strength nic salt • 20mg'
  },

  // ========== BONGS ==========
  {
    id: 13,
    name: 'Glass Bong – Classic 11"',
    category: 'bong',
    price: 8000,
    image: '/products/bong-classic.jpg',
    description: 'Thick glass • Ice catcher • Diffuser'
  },
  {
    id: 14,
    name: 'Beaker Bong – 14"',
    category: 'bong',
    price: 13000,
    image: '/products/bong-beaker.jpg',
    description: 'Heavy base • 5mm glass • Splash guard'
  },
  {
    id: 15,
    name: 'Mini Bong – 8"',
    category: 'bong',
    price: 5500,
    image: '/products/bong-mini.jpg',
    description: 'Compact size • Easy to clean'
  },
  {
    id: 16,
    name: 'Perc Bong – 12"',
    category: 'bong',
    price: 11000,
    image: '/products/bong-perc.jpg',
    description: 'Honeycomb perc • Smooth hits'
  },

  // ========== ROLLING PAPERS ==========
  {
    id: 17,
    name: 'Rolling Papers – King Size',
    category: 'rollingpaper',
    price: 300,
    image: '/products/papers-king.jpg',
    description: 'King size • Slow burning'
  },
  {
    id: 18,
    name: 'Rolling Papers – 1¼ Size',
    category: 'rollingpaper',
    price: 250,
    image: '/products/papers-regular.jpg',
    description: 'Classic 1¼ size • 50 leaves'
  },
  {
    id: 19,
    name: 'Rolling Papers – Unbleached',
    category: 'rollingpaper',
    price: 350,
    image: '/products/papers-unbleached.jpg',
    description: 'Natural unbleached paper'
  },
  {
    id: 20,
    name: 'Rolling Papers – Flavoured Pack',
    category: 'rollingpaper',
    price: 1200,
    image: '/products/papers-flavoured.jpg',
    description: 'Mixed flavours • 25 Booklets'
  },
  {
    id: 21,
    name: 'Tips ',
    category: 'rollingpaper',
    price: 200,
    image: '/products/papers-combo.jpg',
    description: ' RAW Original Natural Unrefined Tips'
  },

  // ========== CIGARS ==========
  {
    id: 22,
    name: 'Cigar – Classic Mild',
    category: 'cigar',
    price: 4500,
    image: '/products/cigar-mild.jpg',
    description: 'Mild strength • Smooth draw'
  },
  {
    id: 23,
    name: 'Cigar – Full Bodied',
    category: 'cigar',
    price: 4500,
    image: '/products/cigar-full.jpg',
    description: 'Rich full flavour • Premium leaf'
  },
  {
    id: 24,
    name: 'Mini Cigars – Pack of 10',
    category: 'cigar',
    price: 3000,
    image: '/products/cigar-mini.jpg',
    description: 'Convenient mini size • Pack of 10'
  },
  {
    id: 25,
    name: 'Cigarillos – Sweet',
    category: 'cigar',
    price: 1500,
    image: '/products/cigar-sweet.jpg',
    description: 'Sweet tip • Easy to smoke'
  },

  // ========== ACCESSORIES ==========
  {
    id: 26,
    name: 'Coil Pack – 5pcs',
    category: 'accessory',
    price: 2500,
    image: '/products/coil-pack.jpg',
    description: 'Compatible with most pods'
  },
  {
    id: 27,
    name: 'Silicone Dab Mat',
    category: 'accessory',
    price: 4500,
    image: '/products/dab-mat.jpg',
    description: 'Heat resistant • Non-stick'
  },
  {
    id: 28,
    name: 'Lighter – Torch',
    category: 'accessory',
    price: 3187,
    image: '/products/lighter-torch.jpg',
    description: 'Refillable torch lighter'
  },
  {
    id: 29,
    name: 'Grinder – 4 Piece',
    category: 'accessory',
    price: 8500 ,
    image: '/products/grinder.jpg',
    description: 'Metal grinder • Sharp teeth'
  },
  {
    id: 30,
    name: 'Ashtray – Glass',
    category: 'accessory',
    price: 3000,
    image: '/products/ashtray.jpg',
    description: 'Heavy glass ashtray'
  },
  {
    id: 31,
    name: 'Storage Jar – Smell Proof',
    category: 'accessory',
    price: 2200,
    image: '/products/jar.jpg',
    description: 'Airtight • Smell proof'
  },
  {
    id: 32,
    name: 'Cleaning Kit',
    category: 'accessory',
    price: 2500,
    image: '/products/cleaning-kit.jpg',
    description: 'Brushes + solution for glass'
  }
];