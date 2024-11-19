import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Exportation = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupération des produits pour Exportation
    axios
      .get('http://localhost:5000/api/produits?type=Exportation')
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
    return <p>Aucun produit disponible pour Antananarivo.</p>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center">Produits disponibles à Antananarivo</h1>
      <div className="row">
        {produits.map((produit) => (
          <div key={produit.id} className="col-md-4 mb-4">
            <div className="card">
              {produit.produit_image && (
                <img
                  src={produit.produit_image}
                  className="card-img-top"
                  alt={produit.produit_nom}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{produit.produit_nom}</h5>
                <p className="card-text">Type: {produit.produit_type}</p>
                <p className="card-text">Prix: {produit.produit_prix} Ariary</p>
                <p className="card-text">Fournisseur: {produit.produit_lieu}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exportation;
