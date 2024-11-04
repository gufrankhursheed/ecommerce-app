"use client";

import React, { createContext, useEffect, useState, ReactNode, useMemo, useContext } from "react";

interface CartContextType {
    cartProducts: string[];
    addProduct: (productId: string) => void;
    removeProduct: (productId: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartContextProviderProps {
    children: ReactNode;
}

export function CartContextProvider({ children }: CartContextProviderProps) {
    const [cartProducts, setCartProducts] = useState<string[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                setCartProducts(JSON.parse(storedCart));
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('cart', JSON.stringify(cartProducts));
        }
    }, [cartProducts]);

    const addProduct = (productId: string) => {
        setCartProducts(prev => [...prev, productId]);  // Allows duplicates for testing
    };

    const removeProduct = (productId: string) => {
        setCartProducts(prev => prev.filter(id => id !== productId));
    };

    const clearCart = () => {
        setCartProducts([]);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('cart');
        }
    };

    const value = useMemo(() => ({
        cartProducts,
        addProduct,
        removeProduct,
        clearCart
    }), [cartProducts]);

    return (
        <CartContext.Provider value={{cartProducts, addProduct, removeProduct, clearCart}}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartContextProvider');
    }
    return context;
};


/*
const addProduct = (productId: string) => {
        setCartProducts(prev => {
            if (!prev.includes(productId)) {
                return [...prev, productId];
            }
            return prev;
        });
    };

*/