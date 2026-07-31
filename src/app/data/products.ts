export interface Product {
  id: number;
  name: string;
  category: 'vape' | 'eliquid' | 'bong' | 'accessory';
  price: number;
  image: string;
  description: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Disposable Vape – Mango Ice',
    category: 'vape',
    price: 12.99,
    image: '/products/vape-mango.jpg',
    description: '600 puffs • 5% nicotine • Sweet mango ice'
  },
  {
    id: 2,
    name: 'Disposable Vape – Blue Razz',
    category: 'vape',
    price: 13.50,
    image: '/products/vape-blue-razz.jpg',
    description: '800 puffs • Blue raspberry blast'
  },
  {
    id: 3,
    name: 'E-Liquid – Strawberry Blast 50ml',
    category: 'eliquid',
    price: 14.99,
    image: '/products/eliquid-strawberry.jpg',
    description: '70/30 VG/PG • 3mg nicotine'
  },
  {
    id: 4,
    name: 'E-Liquid – Mint Fresh 50ml',
    category: 'eliquid',
    price: 13.99,
    image: '/products/eliquid-mint.jpg',
    description: 'Cool mint • 6mg nicotine'
  },
  {
    id: 5,
    name: 'Glass Bong – Classic 12"',
    category: 'bong',
    price: 49.99,
    image: '/products/bong-classic.jpg',
    description: 'Thick glass • Ice catcher • Diffuser'
  },
  {
    id: 6,
    name: 'Beaker Bong – 14"',
    category: 'bong',
    price: 59.99,
    image: '/products/bong-beaker.jpg',
    description: 'Heavy base • 5mm glass • Splash guard'
  },
  {
    id: 7,
    name: 'Coil Pack – 5pcs',
    category: 'accessory',
    price: 9.99,
    image: '/products/coil-pack.jpg',
    description: 'Compatible with most pods'
  },
  {
    id: 8,
    name: 'Silicone Dab Mat',
    category: 'accessory',
    price: 7.50,
    image: '/products/dab-mat.jpg',
    description: 'Heat resistant • Non-stick'
  }
];