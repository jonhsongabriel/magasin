// src/SearchResultsPage.js — Affiche les produits trouvés par la recherche
import React, { useContext, useState } from 'react';
import { SearchContext } from './SearchContext';

const SearchResultsPage = () => {
  const { searchResults, handleSearch } = useContext(SearchContext);
  const [query, setQuery] = useState('');

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    handleSearch(event.target.value);
  };

  return (
    <div className="container my-5">
      <h2>🔍 Recherche de produits</h2>
      <input
        type="text"
        className="form-control my-3"
        value={query}
        onChange={handleInputChange}
        placeholder="Rechercher un produit (nom ou description)…"
        autoFocus
      />
      <div className="row">
        {searchResults.length > 0 ? (
          searchResults.map((produit) => (
            <div className="col-md-4 mb-4" key={produit.id}>
              <div className="card h-100 shadow-sm">
                {produit.produit_image && (
                  <img
                    src={produit.produit_image}
                    className="card-img-top"
                    alt={produit.produit_nom}
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{produit.produit_nom}</h5>
                  <p className="card-text text-muted">{produit.produit_description}</p>
                  <p className="fw-bold text-success">{produit.produit_prix} Ar</p>
                  <span className="badge bg-secondary me-1">{produit.produit_type}</span>
                  <span className="badge bg-info text-dark">{produit.produit_lieu}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">Aucun résultat trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;

