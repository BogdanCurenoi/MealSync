import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('mealsync_cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('mealsync_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item) => {
        setCart(prev => {
            const key = item.meal_id ? `meal_${item.meal_id}` : `menu_${item.menu_id}`;
            const existing = prev.find(i => (i.meal_id ? `meal_${i.meal_id}` : `menu_${i.menu_id}`) === key);
            if (existing) {
                return prev.map(i => (i.meal_id ? `meal_${i.meal_id}` : `menu_${i.menu_id}`) === key
                    ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (key) => setCart(prev => prev.filter(i => (i.meal_id ? `meal_${i.meal_id}` : `menu_${i.menu_id}`) !== key));

    const updateQuantity = (key, quantity) => {
        if (quantity < 1) return removeFromCart(key);
        setCart(prev => prev.map(i => (i.meal_id ? `meal_${i.meal_id}` : `menu_${i.menu_id}`) === key ? { ...i, quantity } : i));
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('mealsync_cart');
    };

    const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
