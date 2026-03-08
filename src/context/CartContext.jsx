import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((product, quantity = 1, size, color) => {
    setCartItems(prev => {
      const key = `${product.id}-${size}-${color}`;
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { ...product, quantity, size, color, key }];
    });
  }, []);

  const removeFromCart = useCallback((key) => {
    setCartItems(prev => prev.filter(i => i.key !== key));
  }, []);

  const updateQuantity = useCallback((key, quantity) => {
    if (quantity < 1) return;
    setCartItems(prev => prev.map(i => i.key === key ? { ...i, quantity } : i));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
      cartCount, subtotal, isCartOpen, setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
