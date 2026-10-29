// src/componement/ProduitCard.js — Carte produit réutilisable avec ajout au panier
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';

const ProduitCard = ({ produit }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Normalisation : le contexte panier travaille avec id / nom / prix / image.
  const produitNormalise = {
    id: produit.id,
    nom: produit.produit_nom,
    prix: Number(produit.produit_prix) || 0,
    image: produit.produit_image || null,
    type: produit.produit_type || '',
    lieu: produit.produit_lieu || '',
  };

  const handleAdd = () => {
    addToCart(produitNormalise, 1);
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm">
        <Link to={`/produit/${produit.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          {produit.produit_image && (
            <img
              src={produit.produit_image}
              className="card-img-top"
              alt={produit.produit_nom}
              style={{ height: 200, objectFit: 'cover' }}
            />
          )}
          <div className="card-body d-flex flex-column">
            <h5 className="card-title">{produit.produit_nom}</h5>
            <p className="card-text mb-1">Type : {produit.produit_type}</p>
            <p className="card-text mb-1 fw-bold text-success">
              Prix : {Number(produit.produit_prix).toLocaleString('fr-FR')} Ariary
            </p>
            <p className="card-text">Fournisseur : {produit.produit_lieu}</p>
          </div>
        </Link>
        <div className="card-footer bg-white border-0 d-flex gap-2">
          <button
            type="button"
            className="btn btn-warning flex-fill"
            onClick={() => navigate(`/produit/${produit.id}`)}
          >
            👁️ Voir détail
          </button>
          <button
            type="button"
            className="btn btn-outline-success"
            onClick={handleAdd}
            title="Ajouter au panier"
          >
            🛒
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProduitCard;
