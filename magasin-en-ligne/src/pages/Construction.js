import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProduitCard from '../componement/ProduitCard';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Construction = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // RÃ©cupÃ©ration des produits pour Construction
    axios
      .get(API_URL + '/api/produits?type=Construction')
      .then((response) => {
        setProduits(response.data.produits);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la rÃ©cupÃ©ration des produits:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Chargement des produits...</p>;
  }

  if (produits.length === 0) {
    return <p>Aucun produit disponible pour les construction.</p>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center">Produits des construction</h1>
      <div className="row">
        {produits.map((produit) => (
          <ProduitCard key={produit.id} produit={produit} />
        ))}
      </div>
    </div>
  );
};

export default Construction;


