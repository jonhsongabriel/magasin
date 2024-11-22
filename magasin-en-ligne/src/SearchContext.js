// src/SearchContext.js
import React, { createContext, useState } from 'react';

// Données locales directement dans ce fichier
const data = [
  { name: 'Antananarivo', slug: 'antananarivo' },
  { name: 'Mahajanga', slug: 'mahajanga' },
  { name: 'Fianarantsoa', slug: 'fianarantsoa' },
  // Ajoutez ici plus de données à rechercher
];

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query) => {
    const results = data.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
    setSearchResults(results);
  };

  return (
    <SearchContext.Provider value={{ handleSearch, searchResults }}>
      {children}
    </SearchContext.Provider>
  );
};
