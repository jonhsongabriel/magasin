import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProduitCard from '../componement/ProduitCard';

const Tech = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupération des produits pour Tech
    axios
      .get('http://localhost:5000/api/produits?type=Tech')
      .then((response) => {
        setProduits(response.data.produits);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des produits:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Chargement des produits...</p>;
  }

  if (produits.length === 0) {
    return <p>Aucun produit technologique disponible pour le moment.</p>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center text-success">Produits technologiques</h1>
      <div className="row">
        {produits.map((produit) => (
          <ProduitCard key={produit.id} produit={produit} />
        ))}
      </div>
    </div>
  );
};

export default Tech;
