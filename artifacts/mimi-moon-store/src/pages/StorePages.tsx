import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, ChevronLeft, Heart, Minus, Plus, Search as SearchIcon, Sparkles, Trash2, Truck } from 'lucide-react';
import { Link, useLocation, useParams } from 'wouter';
import { categories, getProduct, products, type Product } from '@/lib/catalog';
import { useStore } from '@/hooks/useStore';
import { useToast } from '@/components/toast';
import { ProductCard, ProductGrid } from '@/components/ProductCard';
import { EmptyState, ErrorState, LoadingGrid } from '@/components/States';
import { CloudLine, MoonFlower, Star } from '@/components/Decor';

const PageIntro = ({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) => <div className="mm-container mm-page-intro"><div><div className="mm-eyebrow">{eyebrow}</div><h1>{title}</h1></div>{body && <p>{body}</p>}</div>;

export const HomePage = () => {
  const { notify } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const submitNews = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.includes('@')) { notify('Please add a real email address', 'error'); return; }
    setLoading(true);
    window.setTimeout(() => { localStorage.setItem('mimi-newsletter', email); setLoading(false); setEmail(''); notify('You are on the list. A little magic is on its way.', 'success'); }, 550);
  };
  const featured = products.slice(0, 4);
  return <>
    <section className="mm-hero">
      <div className="mm-cloud cloud-one" /><div className="mm-cloud cloud-two" />
      <div className="mm-container mm-hero-inner">
        <div className="mm-hero-copy mm-reveal"><div className="mm-eyebrow">A little wonder, well worn</div><h1>Dress for the softest <em>days.</em></h1><p>Pretty things for everyday adventures, designed in small batches and made to stay in your story.</p><Link href="/shop" className="mm-button mm-button-primary" data-testid="link-hero-shop">Shop the new edit <ArrowRight size={16} /></Link></div>
        <div className="mm-hero-art" aria-label="Illustration of a rose dress"><Star className="sparkle-one" /><Star className="sparkle-two" /><Star className="sparkle-three" /><div className="mm-hero-dress" /></div>
      </div>
    </section>
    <div className="mm-feature-band"><div className="mm-container mm-feature-grid"><div className="mm-feature"><span className="mm-feature-icon"><Heart size={16} /></span>Thoughtful, easy silhouettes</div><div className="mm-feature"><span className="mm-feature-icon"><Sparkles size={16} /></span>Small-batch, never ordinary</div><div className="mm-feature"><span className="mm-feature-icon"><Truck size={16} /></span>Free shipping over $120</div></div></div>
    <section className="mm-container mm-section"><div className="mm-section-heading"><div><div className="mm-eyebrow">Just in from the moon</div><h2>The new little things</h2></div><Link href="/shop" className="mm-text-link" data-testid="link-home-view-all">View all pieces <ArrowRight size={14} /></Link></div><ProductGrid items={featured} /></section>
    <section className="mm-container mm-section"><div className="mm-story"><div className="mm-story-art"><MoonFlower /></div><div className="mm-story-copy"><div className="mm-eyebrow">Our north star</div><h2>Clothes with a bit of story in them.</h2><p>Mimi &amp; Moon began with a sketchbook, a cup of tea, and a belief that getting dressed can change the weather inside your day. We make the pieces we want to reach for again and again: soft, considered, and a little bit unexpected.</p><Link href="/about" className="mm-text-link" data-testid="link-home-story">Meet Mimi &amp; Moon <ArrowRight size={14} /></Link></div></div></section>
    <section className="mm-container mm-section"><div className="mm-newsletter"><div><div className="mm-eyebrow" style={{ color: 'hsl(var(--accent))' }}>Letters from the moon</div><h2>Come along for the pretty bits.</h2><p>New drops, studio notes, and first dibs on the good stuff. No noise, just nice things.</p></div><form className="mm-news-form" onSubmit={submitNews}><input className="mm-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" aria-label="Email address" data-testid="input-newsletter-email" /><button className="mm-button mm-button-pink" disabled={loading} data-testid="button-newsletter-submit">{loading ? 'Joining…' : 'Join us'}</button></form></div></section>
  </>;
};

export const ShopPage = () => {
  const [category, setCategory] = useState<string>('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => setLoading(false), 320); return () => window.clearTimeout(timer); }, []);
  const filtered = useMemo(() => {
    const list = products.filter((product) => (category === 'All' || product.category === category) && `${product.name} ${product.color} ${product.category}`.toLowerCase().includes(query.toLowerCase()));
    return [...list].sort((a, b) => sort === 'price-low' ? a.price - b.price : sort === 'price-high' ? b.price - a.price : sort === 'newest' ? b.createdAt - a.createdAt : b.popularity - a.popularity);
  }, [category, query, sort]);
  if (failed) return <div className="mm-container mm-page"><ErrorState retry={() => setFailed(false)} /></div>;
  if (loading) return <><PageIntro eyebrow="The shop" title="Find your everyday magic." body="Gathering the good things…" /><div className="mm-container"><LoadingGrid /></div></>;
  return <><PageIntro eyebrow="The shop" title="Find your everyday magic." body="Small-batch pieces with soft lines, good pockets, and a little something you can't quite put your finger on." /><div className="mm-container"><div className="mm-shop-controls"><div className="mm-search-wrap"><SearchIcon size={16} /><input className="mm-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the collection" aria-label="Search products" data-testid="input-shop-search" /></div><div className="mm-filter-line"><div className="mm-pill-row">{categories.map((item) => <button key={item} className={`mm-pill ${category === item ? 'active' : ''}`} onClick={() => setCategory(item)} data-testid={`button-category-${item.toLowerCase()}`}>{item}</button>)}</div><select className="mm-select mm-sort" value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products" data-testid="select-sort"><option value="featured">Sort: Featured</option><option value="newest">Newest first</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="popular">Most loved</option></select></div></div>{filtered.length ? <ProductGrid items={filtered} /> : <EmptyState title="No pieces found" body="Try a softer search or choose another little category." action="Clear filters" href="/shop" />}</div></>;
};

export const CollectionsPage = () => <><PageIntro eyebrow="Little worlds to wear" title="Collections" body="Choose a mood, then let the outfit take it from there." /><div className="mm-container mm-section" style={{ paddingTop: 0 }}><div className="mm-collection-grid">
  {[['collection-pink', 'The Soft Hour', 'Rosewater, ribbons, and slow mornings.'], ['collection-sage', 'Garden Walk', 'Easy layers for wherever you wander.'], ['collection-cream', 'Moonlight', 'A little shine after sunset.'], ['collection-brown', 'The Everyday Edit', 'Reliable favourites, with better details.']].map(([tone, title, body]) => <Link href="/shop" className={`mm-collection-card ${tone}`} key={title} data-testid={`link-collection-${title.toLowerCase().replaceAll(' ', '-')}`}><div className="mm-collection-blob" /><h2>{title}</h2><p>{body}</p></Link>)}
</div></div></>;

export const SearchPage = () => {
  const [location] = useLocation();
  const initial = new URLSearchParams(location.split('?')[1] || '').get('q') || '';
  const [query, setQuery] = useState(initial);
  const results = products.filter((product) => `${product.name} ${product.category} ${product.color}`.toLowerCase().includes(query.toLowerCase()));
  return <><PageIntro eyebrow="Search the moon" title={query ? `Results for “${query}”` : 'What are you looking for?'} body="Try a colour, a feeling, or a piece you want to live in." /><div className="mm-container"><div className="mm-search-wrap" style={{ width: '100%', marginBottom: '2.4rem' }}><SearchIcon size={16} /><input className="mm-input" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “rose”, “knit”, or “dress”" aria-label="Search all products" data-testid="input-search-page" /></div>{results.length ? <ProductGrid items={results} /> : <EmptyState title="Nothing under that moon" body="No exact matches yet, but there are plenty of lovely things to discover." />}</div></>;
};

export const FavoritesPage = () => {
  const { wishlist } = useStore();
  const items = products.filter((product) => wishlist.includes(product.id));
  return <><PageIntro eyebrow="Saved for later" title="Your favorites" body="The pieces that made you pause. Keep them close until the moment feels right." /><div className="mm-container">{items.length ? <ProductGrid items={items} /> : <EmptyState title="Your moon is still empty" body="When a piece gives you that little feeling, tap the heart and it will wait here for you." action="Find something lovely" />}</div></>;
};

const Summary = ({ subtotal, discount, shipping, promo, setPromo, applyPromo }: { subtotal: number; discount: number; shipping: number; promo: string; setPromo: (value: string) => void; applyPromo: () => void }) => <div className="mm-summary"><h2>Your little bundle</h2><div className="mm-promo-form"><input className="mm-input" value={promo} onChange={(event) => setPromo(event.target.value)} placeholder="Promo code" aria-label="Promo code" data-testid="input-promo" /><button className="mm-button mm-button-soft mm-button-small" onClick={applyPromo} data-testid="button-apply-promo">Apply</button></div>{discount > 0 && <div className="mm-summary-row mm-discount"><span>Moon code</span><span>−${discount.toFixed(2)}</span></div>}<div className="mm-summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div><div className="mm-summary-row"><span>Shipping</span><span>{shipping ? `$${shipping.toFixed(2)}` : 'Free'}</span></div><div className="mm-summary-row total"><span>Total</span><span>${(subtotal - discount + shipping).toFixed(2)}</span></div><Link href="/checkout" className="mm-button mm-button-primary" style={{ width: '100%', marginTop: '1rem' }} data-testid="link-checkout">Go to checkout <ArrowRight size={15} /></Link></div>;

export const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useStore();
  const { notify } = useToast();
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);
  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = useState(0);
  const subtotal = cart.reduce((sum, item) => sum + (getProduct(item.productId)?.price || 0) * item.quantity, 0);
  const shipping = subtotal >= 120 || subtotal === 0 ? 0 : 8;
  const applyPromo = () => { if (promo.trim().toUpperCase() === 'MIMI15') { setDiscount(subtotal * .15); notify('Moon code applied — 15% off your bundle', 'success'); } else notify('That code is sleeping. Try MIMI15', 'error'); };
  return <><PageIntro eyebrow="Your bag" title="A little bundle of joy." body="Review your pieces, make them yours, and get ready for a very nice unboxing." /><div className="mm-container mm-cart-layout">{cart.length ? <div>{cart.map((item, index) => { const product = getProduct(item.productId); if (!product) return null; return <div className="mm-cart-item" key={`${item.productId}-${item.size}-${item.color}`}><img src={product.art} alt={product.artAlt} /><div><Link href={`/product/${product.id}`} data-testid={`link-cart-product-${product.id}`}><h3>{product.name}</h3></Link><div className="mm-cart-meta">{item.color} · {item.size}</div><div style={{ marginTop: '.7rem' }} className="mm-quantity"><button onClick={() => updateQuantity(index, item.quantity - 1)} aria-label="Decrease quantity" data-testid={`button-decrease-${product.id}`}><Minus size={13} /></button><span data-testid={`text-quantity-${product.id}`}>{item.quantity}</span><button onClick={() => updateQuantity(index, item.quantity + 1)} aria-label="Increase quantity" data-testid={`button-increase-${product.id}`}><Plus size={13} /></button></div><br /><button className="mm-remove" onClick={() => setRemoveIndex(index)} data-testid={`button-remove-${product.id}`}><Trash2 size={13} /> Remove</button></div><div className="mm-cart-price">${(product.price * item.quantity).toFixed(2)}</div></div>; })}<Link href="/shop" className="mm-text-link" style={{ display: 'inline-block', marginTop: '1.5rem' }} data-testid="link-continue-shopping"><ChevronLeft size={14} /> Keep browsing</Link></div> : <EmptyState title="Your bag is moon-empty" body="A good outfit may be just around the corner. Let's go look." action="Shop the pieces" />}{cart.length > 0 && <Summary subtotal={subtotal} discount={discount} shipping={shipping} promo={promo} setPromo={setPromo} applyPromo={applyPromo} />}</div>{removeIndex !== null && <div className="mm-dialog-backdrop" role="dialog" aria-modal="true"><div className="mm-dialog"><h2>Let this one go?</h2><p>It will leave your bag, but you can always find it again in the collection.</p><div className="mm-dialog-actions"><button className="mm-button mm-button-cream" onClick={() => setRemoveIndex(null)} data-testid="button-cancel-remove">Keep it</button><button className="mm-button mm-button-primary" onClick={() => { removeFromCart(removeIndex); setRemoveIndex(null); notify('Piece removed from your bag'); }} data-testid="button-confirm-remove">Remove</button></div></div></div>}</>;
};

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProduct(id);
  const { isWishlisted, toggleWishlist, addToCart } = useStore();
  const { notify } = useToast();
  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState(product?.sizes[0] || '');
  const [quantity, setQuantity] = useState(1);
  if (!product) return <div className="mm-container mm-page"><EmptyState title="That piece wandered off" body="This product isn't part of the collection anymore, but something else lovely is." /></div>;
  const images = [product.art, product.art, product.art];
  const add = () => { addToCart({ productId: product.id, size, color: product.color, quantity }); notify(`${product.name} is in your bag`, 'success'); };
  return <div className="mm-container mm-detail"><div className="mm-gallery"><div className="mm-thumbs">{images.map((image, index) => <button className={`mm-thumb ${imageIndex === index ? 'active' : ''}`} key={index} onClick={() => setImageIndex(index)} aria-label={`View image ${index + 1}`} data-testid={`button-gallery-${index}`}><img src={image} alt="" /></button>)}</div><div className="mm-gallery-main"><img src={images[imageIndex]} alt={product.artAlt} /></div></div><div className="mm-detail-info"><div className="mm-eyebrow">{product.category} · {product.badge || 'Made in small batches'}</div><h1>{product.name}</h1><div className="mm-detail-price">${product.price} {product.oldPrice && <span className="mm-price-old">${product.oldPrice}</span>}</div><p className="mm-detail-copy">{product.description}</p><div className="mm-option"><div className="mm-option-title"><span>Colour</span><span>{product.color}</span></div><div className="mm-option-buttons"><button className="mm-option-btn active mm-color-dot" style={{ background: product.colorHex }} onClick={() => notify(`${product.color} selected`)} aria-label={product.color} data-testid="button-select-color" /></div></div><div className="mm-option"><div className="mm-option-title"><span>Size</span><Link href="/about" className="mm-text-link" style={{ fontSize: '.7rem' }} data-testid="link-size-guide">Size guide</Link></div><div className="mm-option-buttons">{product.sizes.map((item) => <button key={item} className={`mm-option-btn ${size === item ? 'active' : ''}`} onClick={() => setSize(item)} data-testid={`button-size-${item}`}>{item}</button>)}</div></div><div className="mm-option"><div className="mm-option-title"><span>Quantity</span></div><div className="mm-quantity"><button onClick={() => setQuantity((current) => Math.max(1, current - 1))} aria-label="Decrease quantity" data-testid="button-detail-decrease"><Minus size={14} /></button><span data-testid="text-detail-quantity">{quantity}</span><button onClick={() => setQuantity((current) => current + 1)} aria-label="Increase quantity" data-testid="button-detail-increase"><Plus size={14} /></button></div></div><div className="mm-detail-actions"><button className="mm-button mm-button-primary" onClick={add} data-testid="button-add-to-cart">Add to bag <ShoppingBagIcon /></button><button className="mm-button mm-button-cream" onClick={() => { toggleWishlist(product.id); notify(isWishlisted(product.id) ? 'Removed from favorites' : 'Saved to favorites', 'success'); }} data-testid="button-detail-wishlist"><Heart size={17} fill={isWishlisted(product.id) ? 'currentColor' : 'none'} /> {isWishlisted(product.id) ? 'Saved' : 'Save'}</button></div></div></div>;
};

const ShoppingBagIcon = () => <span aria-hidden="true">+</span>;

export const AboutPage = () => <div className="mm-container mm-page"><section className="mm-about-hero"><div className="mm-eyebrow">The Mimi &amp; Moon story</div><h1>For the days you wish would last a little longer.</h1><p>We make clothes for the in-between moments: first coffees, long walks, dinner that becomes dessert.</p><CloudLine /></section><div className="mm-about-layout"><h2>A boutique with its head in the clouds.</h2><p>Mimi &amp; Moon is an independent womenswear label with a soft spot for beautiful details. We started small, sketching pieces that felt polished enough for plans but comfortable enough for staying in. Every collection is a gentle invitation to dress like yourself, only a little more joyfully.</p><p>Our clothes are designed in Copenhagen and made in small runs with partners we know by name. We choose considered fabrics, keep our drops intentionally little, and believe the best pieces are the ones that become part of your personal mythology.</p><div className="mm-values"><div className="mm-value"><MoonFlower /><h3>Soft but certain</h3><p>Feminine silhouettes with enough ease to move through real life.</p></div><div className="mm-value"><Star /><h3>Small on purpose</h3><p>Limited runs keep the collection feeling special and the waste low.</p></div><div className="mm-value"><Heart /><h3>Made to be kept</h3><p>Details you notice today, quality you appreciate years from now.</p></div></div></div></div>;

export const CheckoutPage = () => {
  const { cart, clearCart } = useStore();
  const { notify } = useToast();
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', address: '', city: '', postal: '', card: '' });
  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const subtotal = cart.reduce((sum, item) => sum + (getProduct(item.productId)?.price || 0) * item.quantity, 0);
  const shipping = subtotal >= 120 ? 0 : 8;
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const applyPromo = () => { if (promo.trim().toUpperCase() === 'MIMI15') { setDiscount(subtotal * .15); notify('Moon code applied — 15% off', 'success'); } else notify('Try the code MIMI15', 'error'); };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!cart.length) { notify('Your bag is empty — add a piece before checking out', 'error'); return; }
    const required: Array<keyof typeof form> = ['firstName', 'lastName', 'email', 'address', 'city', 'postal', 'card'];
    const next = Object.fromEntries(required.filter((key) => !form[key].trim()).map((key) => [key, 'Please fill this in'])) as Record<string, string>;
    if (form.email && !form.email.includes('@')) next.email = 'Please check your email';
    if (form.card && form.card.replaceAll(' ', '').length < 12) next.card = 'Please enter a valid card number';
    setErrors(next);
    if (Object.keys(next).length) { notify('A couple of details need your attention', 'error'); return; }
    sessionStorage.setItem('mimi-order', JSON.stringify({ name: form.firstName, total: subtotal - discount + shipping, number: `MM-${Date.now().toString().slice(-6)}` }));
    clearCart();
    setLocation('/order-confirmation');
  };
  if (!cart.length) return <div className="mm-container mm-page"><EmptyState title="Nothing to check out yet" body="Your order summary will appear here once you find something to love." action="Browse the shop" /></div>;
  return <><PageIntro eyebrow="Almost yours" title="Checkout" body="Just a few details and your little bundle will be on its way." /><div className="mm-container mm-checkout-layout"><form className="mm-checkout-form" onSubmit={submit}><h2>Delivery details</h2><div className="mm-form-grid">{[['firstName', 'First name'], ['lastName', 'Last name'], ['email', 'Email address'], ['address', 'Address'], ['city', 'City'], ['postal', 'Postcode'], ['card', 'Card number']].map(([key, label], index) => <label className={`mm-label ${key === 'address' || key === 'card' ? 'mm-form-full' : ''}`} key={key}>{label}<input className="mm-input" value={form[key as keyof typeof form]} onChange={(event) => update(key as keyof typeof form, event.target.value)} placeholder={key === 'card' ? '1234 5678 9012 3456' : ''} data-testid={`input-checkout-${key}`} />{errors[key] && <span className="mm-field-error">{errors[key]}</span>}</label>)}</div><button className="mm-button mm-button-primary" style={{ width: '100%', marginTop: '1.5rem' }} type="submit" data-testid="button-place-order">Place my order <ArrowRight size={16} /></button></form><Summary subtotal={subtotal} discount={discount} shipping={shipping} promo={promo} setPromo={setPromo} applyPromo={applyPromo} /></div></>;
};

export const ConfirmationPage = () => {
  const [location, setLocation] = useLocation();
  const order = sessionStorage.getItem('mimi-order');
  const parsed = order ? JSON.parse(order) as { name: string; total: number; number: string } : null;
  return <div className="mm-container mm-page">{parsed ? <div className="mm-order-confirmed mm-reveal"><div className="mm-confirm-mark"><Check size={34} /></div><div className="mm-eyebrow">The nicest kind of news</div><h1>It's on its way, {parsed.name}.</h1><p>Thank you for choosing a little magic. Your order <strong>{parsed.number}</strong> is tucked away and we’ll send a note when it begins its journey. Total: <strong>${parsed.total.toFixed(2)}</strong>.</p><Link href="/shop" className="mm-button mm-button-primary" data-testid="link-confirmation-shop">Keep exploring <ArrowRight size={16} /></Link></div> : <EmptyState title="No order here yet" body="Once you place an order, its happy ending will appear here." />}</div>;
};