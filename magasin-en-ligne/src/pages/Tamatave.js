import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProduitCard from '../componement/ProduitCard';
import { Link } from 'react-router-dom';

const Tamatave = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // RÃ©cupÃ©ration des produits pour Antsiranana
    axios
      .get('http://localhost:5000/api/produits?lieu=Tamatave')
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
    return <p>Aucun produit disponible pour Tamatave.</p>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center">Produits disponibles Ã  Tamatave</h1>
      <div className="row">
        {produits.map((produit) => (
          <ProduitCard key={produit.id} produit={produit} />
        ))}
      </div>
      <div className='btn btn-primary'>
      <Link className="nav-Link text-white" to="Action/AjoutProduit">Connection</Link>
    </div>
    </div>
    
  );
  
};

export default Tamatave;
