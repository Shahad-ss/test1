import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CartItem } from '@/lib/catalog';

const CART_KEY = 'luna-belle-cart';
const WISHLIST_KEY = 'luna-belle-wishlist';
const LEGACY_CART_KEY = 'mimi-moon-cart';
const LEGACY_WISHLIST_KEY = 'mimi-moon-wishlist';

const read = <T,>(key: string, fallback: T, legacyKey?: string): T => {
  try {
    const value = localStorage.getItem(key) ?? (legacyKey ? localStorage.getItem(legacyKey) : null);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
};

const createStore = () => {
  const [cart, setCart] = useState<CartItem[]>(() => read<CartItem[]>(CART_KEY, [], LEGACY_CART_KEY));
  const [wishlist, setWishlist] = useState<string[]>(() => read<string[]>(WISHLIST_KEY, [], LEGACY_WISHLIST_KEY));

  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist)); }, [wishlist]);

  const addToCart = useCallback((item: CartItem) => {
    setCart((current) => {
      const match = current.find((entry) => entry.productId === item.productId && entry.size === item.size && entry.color === item.color);
      if (match) return current.map((entry) => entry === match ? { ...entry, quantity: entry.quantity + item.quantity } : entry);
      return [...current, item];
    });
  }, []);
  const updateQuantity = useCallback((index: number, quantity: number) => {
    setCart((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, quantity: Math.max(1, quantity) } : item));
  }, []);
  const removeFromCart = useCallback((index: number) => setCart((current) => current.filter((_, itemIndex) => itemIndex !== index)), []);
  const clearCart = useCallback(() => setCart([]), []);
  const toggleWishlist = useCallback((id: string) => setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]), []);

  return useMemo(() => ({
    cart, wishlist, addToCart, updateQuantity, removeFromCart, clearCart, toggleWishlist,
    cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    isWishlisted: (id: string) => wishlist.includes(id),
  }), [cart, wishlist, addToCart, updateQuantity, removeFromCart, clearCart, toggleWishlist]);
};

type StoreValue = ReturnType<typeof createStore>;
const StoreContext = createContext<StoreValue | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => <StoreContext.Provider value={createStore()}>{children}</StoreContext.Provider>;

export const useStore = () => {
  const value = useContext(StoreContext);
  if (!value) throw new Error('useStore must be used inside StoreProvider');
  return value;
};