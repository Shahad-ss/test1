import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'wouter';
import type { Product } from '@/lib/catalog';
import { useStore } from '@/hooks/useStore';
import { useToast } from '@/components/toast';

export const ProductCard = ({ product }: { product: Product }) => {
  const { isWishlisted, toggleWishlist, addToCart } = useStore();
  const { notify } = useToast();
  const wished = isWishlisted(product.id);
  const quickAdd = () => {
    addToCart({ productId: product.id, size: product.sizes.includes('M') ? 'M' : product.sizes[0], color: product.color, quantity: 1 });
    notify(`${product.name} was added to your bag`, 'success');
  };
  return <article className="mm-product-card mm-reveal" data-testid={`card-product-${product.id}`}>
    <div className="mm-product-visual">
      <Link href={`/product/${product.id}`} data-testid={`link-product-${product.id}`}><img src={product.art} alt={product.artAlt} /></Link>
      {product.badge && <span className="mm-product-badge">{product.badge}</span>}
      <button className="mm-icon-button mm-card-heart" onClick={() => { toggleWishlist(product.id); notify(wished ? 'Removed from favorites' : 'Saved to favorites', 'success'); }} aria-label={wished ? 'Remove from favorites' : 'Add to favorites'} data-testid={`button-wishlist-${product.id}`}><Heart size={18} fill={wished ? 'currentColor' : 'none'} /></button>
    </div>
    <div className="mm-product-info">
      <Link href={`/product/${product.id}`} data-testid={`link-product-name-${product.id}`}><h3>{product.name}</h3></Link>
      <p>{product.color}</p>
      <div className="mm-product-price">${product.price}<button className="mm-icon-button" style={{ float: 'right', width: 28, height: 28 }} onClick={quickAdd} aria-label={`Add ${product.name} to bag`} data-testid={`button-quick-add-${product.id}`}><ShoppingBag size={15} /></button></div>
    </div>
  </article>;
};

export const ProductGrid = ({ items }: { items: Product[] }) => <div className="mm-product-grid">{items.map((product) => <ProductCard key={product.id} product={product} />)}</div>;