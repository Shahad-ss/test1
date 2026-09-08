export type Product = {
  id: string;
  name: string;
  category: 'Dresses' | 'Knitwear' | 'Tops' | 'Bottoms' | 'Accessories';
  price: number;
  oldPrice?: number;
  color: string;
  colorHex: string;
  sizes: string[];
  description: string;
  badge?: string;
  popularity: number;
  createdAt: number;
  art: string;
  artAlt: string;
};

export type CartItem = {
  productId: string;
  size: string;
  color: string;
  quantity: number;
};

export const products: Product[] = [
  { id: 'luna-dress', name: 'Luna Ribbon Dress', category: 'Dresses', price: 118, oldPrice: 148, color: 'Rosewater', colorHex: '#d99bab', sizes: ['XS', 'S', 'M', 'L', 'XL'], description: 'A softly structured midi with a sweetheart neckline, ribbon ties, and a skirt made for slow twirls.', badge: 'Bestseller', popularity: 98, createdAt: 12, art: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85', artAlt: 'Woman wearing an elegant rose-toned dress' },
  { id: 'cloud-cardigan', name: 'Cloudberry Cardigan', category: 'Knitwear', price: 86, color: 'Sage Mist', colorHex: '#a9b9a0', sizes: ['XS', 'S', 'M', 'L'], description: 'A brushed, button-front cardigan with a little cloud-softness for cool mornings and moonlit walks.', badge: 'New', popularity: 91, createdAt: 18, art: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=1200&q=85', artAlt: 'Neutral knitwear photographed in a fashion studio' },
  { id: 'petal-blouse', name: 'Petal Tie Blouse', category: 'Tops', price: 72, color: 'Vanilla', colorHex: '#ecdcb9', sizes: ['XS', 'S', 'M', 'L', 'XL'], description: 'A floaty blouse with a tie neck and gathered sleeves. Tuck it into denim or let it wander free.', popularity: 83, createdAt: 8, art: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=85', artAlt: 'Woman wearing a soft everyday blouse' },
  { id: 'meadow-skirt', name: 'Meadow Bias Skirt', category: 'Bottoms', price: 94, oldPrice: 110, color: 'Dusty Rose', colorHex: '#ce919b', sizes: ['XS', 'S', 'M', 'L'], description: 'A satin-feel bias skirt that catches the light beautifully, with an elasticated back for real-life comfort.', badge: 'Soft sale', popularity: 79, createdAt: 6, art: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85', artAlt: 'Fashion portrait featuring a flowing skirt' },
  { id: 'moonlight-knit', name: 'Moonlight Knit', category: 'Knitwear', price: 78, color: 'Oat Milk', colorHex: '#d8c8a9', sizes: ['XS', 'S', 'M', 'L', 'XL'], description: 'The everyday knit with a delicate pointelle texture and sleeves that gather at the wrist.', popularity: 87, createdAt: 20, art: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85', badge: 'New', artAlt: 'Woman styled in soft neutral knitwear' },
  { id: 'ribbon-cami', name: 'Ribbon Cami', category: 'Tops', price: 54, color: 'Berry Bloom', colorHex: '#a86d77', sizes: ['XS', 'S', 'M', 'L'], description: 'A pretty, uncomplicated cami with adjustable straps and just enough sheen for dinner after dusk.', popularity: 74, createdAt: 4, art: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1200&q=85', artAlt: 'Woman wearing a delicate evening top' },
  { id: 'fawn-trousers', name: 'Fawn Wide Trousers', category: 'Bottoms', price: 102, color: 'Toasted Almond', colorHex: '#b69578', sizes: ['XS', 'S', 'M', 'L', 'XL'], description: 'High-waisted, wide-leg trousers with a soft pleat and a pocket for every small treasure.', popularity: 81, createdAt: 9, art: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85', artAlt: 'Street-style portrait featuring wide-leg trousers' },
  { id: 'bow-bag', name: 'Little Bow Bag', category: 'Accessories', price: 64, color: 'Moss Ribbon', colorHex: '#768d73', sizes: ['One size'], description: 'A small structured shoulder bag finished with a sculptural bow. Small, but surprisingly good at carrying the day.', badge: 'Giftable', popularity: 89, createdAt: 16, art: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=1200&q=85', artAlt: 'Boutique fashion accessories and clothing' },
];

export const getProduct = (id?: string) => products.find((product) => product.id === id);

export const categories = ['All', 'Dresses', 'Knitwear', 'Tops', 'Bottoms', 'Accessories'] as const;