'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { PRODUCTS, ProductId } from '@/lib/products';

const STORAGE_KEY = 'picaron_cart_v1';

export interface CartItem {
  productId: ProductId;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotalCents: number;
  addItem: (productId: ProductId, quantity?: number) => void;
  updateQuantity: (productId: ProductId, quantity: number) => void;
  removeItem: (productId: ProductId) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function readStoredItems(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return [];
    return parsed.items.filter(
      (item: unknown): item is CartItem =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as CartItem).productId === 'string' &&
        (item as CartItem).productId in PRODUCTS &&
        Number.isInteger((item as CartItem).quantity) &&
        (item as CartItem).quantity > 0
    );
  } catch {
    return [];
  }
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setItems(readStoredItems());
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items }));
    } catch {
      // storage unavailable (e.g. private browsing) — cart stays in-memory only
    }
  }, [items, hasHydrated]);

  const addItem = (productId: ProductId, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const updateQuantity = (productId: ProductId, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const removeItem = (productId: ProductId) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalCents = items.reduce(
    (sum, item) => sum + item.quantity * PRODUCTS[item.productId].priceCents,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, itemCount, subtotalCents, addItem, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
