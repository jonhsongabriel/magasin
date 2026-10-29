// src/SearchContext.js — Recherche de produits via le backend
import React, { createContext, useState } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (query) => {
    if (!query || query.trim() === '') {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/api/produits?search=${encodeURIComponent(query)}`,
      );
      const data = await res.json();
      setSearchResults(data.produits || []);
    } catch (err) {
      console.error('Erreur de recherche:', err);
      setSearchResults([]);
    }
  };

  return (
    <SearchContext.Provider value={{ handleSearch, searchResults }}>
      {children}
    </SearchContext.Provider>
  );
};
