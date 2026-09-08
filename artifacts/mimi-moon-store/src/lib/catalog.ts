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

const art = (bg: string, garment: string, accent: string, kind: 'dress' | 'top' | 'skirt' | 'bag') => {
  const shape = kind === 'dress'
    ? `<path d="M180 192 L120 510 Q180 550 240 510 L300 192 L258 164 L222 207 L180 207 L138 164Z" fill="${garment}"/><path d="M138 164 L165 122 L195 122 L222 164" fill="none" stroke="${accent}" stroke-width="8"/><path d="M145 285 Q210 320 275 285" fill="none" stroke="${accent}" stroke-width="5"/>`
    : kind === 'skirt'
      ? `<path d="M153 200 L267 200 L320 505 Q210 550 100 505Z" fill="${garment}"/><path d="M147 172 L273 172 L266 215 L154 215Z" fill="${accent}"/><path d="M130 392 Q210 423 290 392" fill="none" stroke="${accent}" stroke-width="6"/>`
      : kind === 'bag'
        ? `<path d="M116 225 Q210 190 304 225 L290 490 Q210 525 130 490Z" fill="${garment}"/><path d="M155 230 Q155 105 210 105 Q265 105 265 230" fill="none" stroke="${accent}" stroke-width="14"/>`
        : `<path d="M137 205 L178 165 L210 204 L242 165 L283 205 L310 490 Q210 530 110 490Z" fill="${garment}"/><path d="M155 220 L265 220" stroke="${accent}" stroke-width="8"/><path d="M156 308 L264 308 M145 386 L275 386" stroke="${accent}" stroke-width="5"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 560"><rect width="420" height="560" rx="42" fill="${bg}"/><circle cx="328" cy="92" r="47" fill="${accent}" opacity=".34"/><circle cx="85" cy="460" r="60" fill="${accent}" opacity=".18"/><text x="42" y="70" fill="${accent}" font-family="Georgia" font-size="21" opacity=".75">mimi &amp; moon</text>${shape}<path d="M66 170 l8 16 17 3 -13 12 3 17 -15 -8 -15 8 3 -17 -13 -12 17 -3z" fill="${accent}" opacity=".75"/></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const products: Product[] = [
  { id: 'luna-dress', name: 'Luna Ribbon Dress', category: 'Dresses', price: 118, oldPrice: 148, color: 'Rosewater', colorHex: '#d99bab', sizes: ['XS', 'S', 'M', 'L', 'XL'], description: 'A softly structured midi with a sweetheart neckline, ribbon ties, and a skirt made for slow twirls.', badge: 'Bestseller', popularity: 98, createdAt: 12, art: art('#ead4d6', '#bb7085', '#f7eee4', 'dress'), artAlt: 'Rosewater midi dress illustration' },
  { id: 'cloud-cardigan', name: 'Cloudberry Cardigan', category: 'Knitwear', price: 86, color: 'Sage Mist', colorHex: '#a9b9a0', sizes: ['XS', 'S', 'M', 'L'], description: 'A brushed, button-front cardigan with a little cloud-softness for cool mornings and moonlit walks.', badge: 'New', popularity: 91, createdAt: 18, art: art('#d6e0d0', '#78957b', '#f3eadc', 'top'), artAlt: 'Sage green cardigan illustration' },
  { id: 'petal-blouse', name: 'Petal Tie Blouse', category: 'Tops', price: 72, color: 'Vanilla', colorHex: '#ecdcb9', sizes: ['XS', 'S', 'M', 'L', 'XL'], description: 'A floaty blouse with a tie neck and gathered sleeves. Tuck it into denim or let it wander free.', popularity: 83, createdAt: 8, art: art('#f1e6ca', '#d6aa75', '#85594a', 'top'), artAlt: 'Vanilla tie neck blouse illustration' },
  { id: 'meadow-skirt', name: 'Meadow Bias Skirt', category: 'Bottoms', price: 94, oldPrice: 110, color: 'Dusty Rose', colorHex: '#ce919b', sizes: ['XS', 'S', 'M', 'L'], description: 'A satin-feel bias skirt that catches the light beautifully, with an elasticated back for real-life comfort.', badge: 'Soft sale', popularity: 79, createdAt: 6, art: art('#e6c2c5', '#b66c7e', '#f5e9db', 'skirt'), artAlt: 'Dusty rose bias cut skirt illustration' },
  { id: 'moonlight-knit', name: 'Moonlight Knit', category: 'Knitwear', price: 78, color: 'Oat Milk', colorHex: '#d8c8a9', sizes: ['XS', 'S', 'M', 'L', 'XL'], description: 'The everyday knit with a delicate pointelle texture and sleeves that gather at the wrist.', popularity: 87, createdAt: 20, art: art('#ded5c4', '#aa987e', '#faf2e6', 'top'), badge: 'New', artAlt: 'Oat milk pointelle knit illustration' },
  { id: 'ribbon-cami', name: 'Ribbon Cami', category: 'Tops', price: 54, color: 'Berry Bloom', colorHex: '#a86d77', sizes: ['XS', 'S', 'M', 'L'], description: 'A pretty, uncomplicated cami with adjustable straps and just enough sheen for dinner after dusk.', popularity: 74, createdAt: 4, art: art('#d7b5b8', '#98636e', '#f8e6d7', 'top'), artAlt: 'Berry pink camisole illustration' },
  { id: 'fawn-trousers', name: 'Fawn Wide Trousers', category: 'Bottoms', price: 102, color: 'Toasted Almond', colorHex: '#b69578', sizes: ['XS', 'S', 'M', 'L', 'XL'], description: 'High-waisted, wide-leg trousers with a soft pleat and a pocket for every small treasure.', popularity: 81, createdAt: 9, art: art('#dbcdbd', '#9d7b61', '#f4e7d3', 'skirt'), artAlt: 'Toasted almond wide leg trousers illustration' },
  { id: 'bow-bag', name: 'Little Bow Bag', category: 'Accessories', price: 64, color: 'Moss Ribbon', colorHex: '#768d73', sizes: ['One size'], description: 'A small structured shoulder bag finished with a sculptural bow. Small, but surprisingly good at carrying the day.', badge: 'Giftable', popularity: 89, createdAt: 16, art: art('#cbd8c8', '#728d75', '#f4ebde', 'bag'), artAlt: 'Moss green bow shoulder bag illustration' },
];

export const getProduct = (id?: string) => products.find((product) => product.id === id);

export const categories = ['All', 'Dresses', 'Knitwear', 'Tops', 'Bottoms', 'Accessories'] as const;