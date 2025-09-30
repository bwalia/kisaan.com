'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface CartItem {
  product_uuid: string;
  variant_uuid?: string;
  name: string;
  variant_title?: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cart: Record<string, CartItem>;
  total: number;
  itemCount: number;
  loading: boolean;
  addToCart: (productUuid: string, quantity?: number, variantUuid?: string) => Promise<void>;
  removeFromCart: (productUuid: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
    if (!user) {
      setCart({});
      setTotal(0);
      setItemCount(0);
      return;
    }

    try {
      setLoading(true);
      const response = await api.getCart();
      
      const cartData = response?.cart || {};
      const totalAmount = response?.total || 0;
      
      let count = 0;
      Object.values(cartData).forEach((item: any) => {
        if (item && typeof item === 'object' && typeof item.quantity === 'number') {
          count += item.quantity;
        }
      });
      
      setCart(cartData);
      setTotal(totalAmount);
      setItemCount(count);
    } catch (error) {
      console.error('Failed to load cart:', error);
      setCart({});
      setTotal(0);
      setItemCount(0);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productUuid: string, quantity: number = 1, variantUuid?: string) => {
    if (!user) {
      toast.error('Please login to add items to cart', {
        id: 'login-required'
      });
      throw new Error('Please login to add items to cart');
    }

    if (!productUuid || quantity <= 0) {
      toast.error('Invalid product or quantity');
      throw new Error('Invalid product or quantity');
    }

    try {
      setLoading(true);
      await api.addToCart({
        product_uuid: productUuid,
        quantity: quantity,
        variant_uuid: variantUuid
      });
      await refreshCart();
      toast.success('Item added to cart!');
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      const errorMessage = error?.message || 'Failed to add item to cart';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productUuid: string) => {
    if (!user) {
      toast.error('Please login to modify cart');
      throw new Error('Please login to modify cart');
    }

    if (!productUuid) {
      toast.error('Invalid product UUID');
      throw new Error('Invalid product UUID');
    }

    try {
      setLoading(true);
      await api.removeFromCart(productUuid);
      await refreshCart();
      toast.success('Item removed from cart');
    } catch (error: any) {
      console.error('Failed to remove from cart:', error);
      const errorMessage = error?.message || 'Failed to remove item from cart';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) {
      toast.error('Please login to clear cart');
      throw new Error('Please login to clear cart');
    }

    try {
      setLoading(true);
      await api.clearCart();
      setCart({});
      setTotal(0);
      setItemCount(0);
      toast.success('Cart cleared');
    } catch (error: any) {
      console.error('Failed to clear cart:', error);
      const errorMessage = error?.message || 'Failed to clear cart';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      setCart({});
      setTotal(0);
      setItemCount(0);
    }
  }, [user]);

  return (
    <CartContext.Provider value={{
      cart,
      total,
      itemCount,
      loading,
      addToCart,
      removeFromCart,
      clearCart,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
