import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProduitCard from './componement/ProduitCard';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Accueil = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupération des produits pour Antsiranana
    axios
      .get(API_URL + '/api/produits')
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
    return <p>Aucun produit disponible Actuel.</p>;
  }

  return (
    <div className="container mt-4">
      <div className='bg-secondary p-4'>
      <div className='row text-center'>       
         <h1 className='text-white'>
          <b>
               Bienvenue dans le mangasin en ligne
          </b>
          </h1>
      </div>
      <div className='row text-center'>
           <h4 className='text-danger'>
               <b>Vous etiez des marchandises ?</b>
           </h4>
           <p className='text-white p-2'>
              Ici il y a une place pour vous pour que vous avez une moyen facile,
              pour publier vous produit à vendre. Ne ratez pas des occassion.
              Une aide qui facilite vous publication, pour que le client vois 
              facilement vos contcat, tous ce qui est disponible dans vos offres .
           </p>
      </div>
      <div className='row text-center'>
           <h4 className='text-danger'>
               <b>Vous cherchez quelque choses pour vos besoin ?</b>
           </h4>
           <p className='text-white p-2'>
              Ici il y a une place pour vous pour que vous avez une moyen facile,
              pour trouver vous produit que vous avez besoin. Ne ratez pas des occassion.
              Une aide qui facilite vous recherche, pour que vous se deplacer pas 
              sans raison. 
              
           </p>
      </div>
      </div>
      <h1 className="text-center">Produits disponibles Maintenant</h1>
      <div className="row">
        {produits.map((produit) => (
          <ProduitCard key={produit.id} produit={produit} />
        ))}
      </div>
    </div>
  );
};

export default Accueil;


