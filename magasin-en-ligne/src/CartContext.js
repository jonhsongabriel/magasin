// src/CartContext.js — Panier d'achat (persistant dans le navigateur)
import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Charger le panier depuis le navigateur (localStorage)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('magasin_cart');
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Erreur lors du chargement du panier:', err);
    }
  }, []);

  // Sauvegarder le panier à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem('magasin_cart', JSON.stringify(cart));
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du panier:', err);
    }
  }, [cart]);

  // Ajouter un produit au panier
  const addToCart = (produit, quantite = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === produit.id);
      if (existing) {
        return prev.map((item) =>
          item.id === produit.id
            ? { ...item, quantite: item.quantite + quantite }
            : item,
        );
      }
      return [...prev, { ...produit, quantite }];
    });
  };

  // Retirer un produit du panier
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Changer la quantité d'un produit
  const changeQuantity = (id, quantite) => {
    if (quantite <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantite } : item)),
    );
  };

  // Vider le panier
  const clearCart = () => {
    setCart([]);
  };

  // Total du panier
  const total = cart.reduce(
    (sum, item) => sum + (item.prix || 0) * (item.quantite || 0),
    0,
  );

  // Nombre d'articles
  const count = cart.reduce((sum, item) => sum + (item.quantite || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        changeQuantity,
        clearCart,
        total,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart doit être utilisé dans un CartProvider');
  }
  return ctx;
}

export default CartContext;

