import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProduitCard from '../componement/ProduitCard';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Toliara = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // RÃ©cupÃ©ration des produits pour Antsiranana
    axios
      .get(API_URL + '/api/produits?lieu=Toliara')
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
    return <p>Aucun produit disponible pour Toliara.</p>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center">Produits disponibles Ã  Toliara</h1>
      <div className="row">
        {produits.map((produit) => (
          <ProduitCard key={produit.id} produit={produit} />
        ))}
      </div>
    </div>
  );
};

export default Toliara;


