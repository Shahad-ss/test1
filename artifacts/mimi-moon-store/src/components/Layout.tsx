import { useState, type ReactNode } from 'react';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useStore } from '@/hooks/useStore';

export const Layout = ({ children }: { children: ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { cartCount, wishlist } = useStore();
  const nav = [
    { href: '/shop', label: 'Shop' },
    { href: '/collections', label: 'Collections' },
    { href: '/about', label: 'Our story' },
  ];
  const goSearch = () => { setMenuOpen(false); setLocation('/search'); };
  return <div className="mm-shell">
    <header className="mm-header">
      <div className="mm-promo">Free shipping on orders over $120 · made for your everyday magic</div>
      <div className="mm-container mm-nav">
        <button className="mm-icon-button mm-mobile-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label="Open menu" data-testid="button-mobile-menu">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        <Link href="/" className="mm-logo" data-testid="link-home"><span className="mm-logo-mark" /> Luna Belle</Link>
        <nav className="mm-nav-links" aria-label="Main navigation">
          {nav.map((item) => <Link key={item.href} href={item.href} className={location === item.href ? 'active' : ''} data-testid={`link-nav-${item.label.toLowerCase().replace(' ', '-')}`}>{item.label}</Link>)}
        </nav>
        <div className="mm-nav-actions">
          <button className="mm-icon-button mm-search-nav" onClick={goSearch} aria-label="Search" data-testid="button-search"><Search size={19} /></button>
          <Link href="/favorites" className="mm-icon-button" aria-label="Favorites" data-testid="link-favorites"><Heart size={19} fill={wishlist.length ? 'currentColor' : 'none'} /><span className="mm-count">{wishlist.length}</span></Link>
          <Link href="/cart" className="mm-icon-button" aria-label="Shopping bag" data-testid="link-cart"><ShoppingBag size={19} /><span className="mm-count">{cartCount}</span></Link>
        </div>
      </div>
      {menuOpen && <nav className="mm-mobile-menu" aria-label="Mobile navigation">
        {nav.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} data-testid={`link-mobile-${item.label.toLowerCase().replace(' ', '-')}`}>{item.label}</Link>)}
        <button onClick={goSearch} data-testid="button-mobile-search">Search the collection</button>
      </nav>}
    </header>
    <main>{children}</main>
    <footer className="mm-footer">
      <div className="mm-container mm-footer-inner">
        <Link href="/" className="mm-logo" data-testid="link-footer-home"><span className="mm-logo-mark" /> Luna Belle</Link>
        <div className="mm-footer-links"><Link href="/shop" data-testid="link-footer-shop">Shop all</Link><Link href="/collections" data-testid="link-footer-collections">Collections</Link><Link href="/about" data-testid="link-footer-about">The story</Link></div>
      </div>
      <div className="mm-container mm-footer-note">Small-batch pieces for big little moments. © Luna Belle.</div>
    </footer>
  </div>;
};