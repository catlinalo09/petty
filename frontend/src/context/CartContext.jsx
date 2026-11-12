import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'petty-cart';
const CartContext = createContext(null);

function readStoredCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => {
    const add = (product) => {
      setItems((current) => {
        const exists = current.some((item) => item.id === product.id);

        if (exists) {
          return current.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
          );
        }

        return [...current, { ...product, qty: 1 }];
      });
    };

    const remove = (id) => {
      setItems((current) => current.filter((item) => item.id !== id));
    };

    const clear = () => setItems([]);

    return {
      items,
      add,
      remove,
      clear,
      count: items.reduce((sum, item) => sum + item.qty, 0),
      total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart debe usarse dentro de <CartProvider>');
  }

  return context;
}
