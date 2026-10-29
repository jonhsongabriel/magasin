// src/pages/DetailProduit.js — Fiche produit publique + commande
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../CartContext';

const API = 'http://localhost:5000';

const DetailProduit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantite, setQuantite] = useState(1);

  useEffect(() => {
    fetch(`${API}/api/produits`)
      .then((res) => res.json())
      .then((data) => {
        const p = (data.produits || []).find((x) => String(x.id) === String(id));
        setProduit(p || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="container my-5 text-center"><p>Chargement…</p></div>;
  }

  if (!produit) {
    return (
      <div className="container my-5 text-center">
        <h3>Produit introuvable</h3>
        <button className="btn btn-warning mt-3" onClick={() => navigate('/')}>
          ← Retour à la boutique
        </button>
      </div>
    );
  }

  const prixTotal = Number(produit.produit_prix) * quantite;

  return (
    <div className="container my-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/">Accueil</a></li>
          <li className="breadcrumb-item active">{produit.produit_type}</li>
        </ol>
      </nav>

      <div className="card shadow-sm">
        <div className="row g-0">
          {/* --- Image --- */}
          <div className="col-md-5">
            {produit.produit_image ? (
              <img
                src={produit.produit_image}
                alt={produit.produit_nom}
                className="img-fluid rounded-start h-100"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div
                className="d-flex align-items-center justify-content-center bg-light h-100"
                style={{ minHeight: 320 }}
              >
                <span style={{ fontSize: 80 }}>📦</span>
              </div>
            )}
          </div>

          {/* --- Infos --- */}
          <div className="col-md-7">
            <div className="card-body p-4">
              <span className="badge bg-warning text-dark mb-2">{produit.produit_type}</span>
              <h1 className="h3">{produit.produit_nom}</h1>
              <p className="text-muted">{produit.produit_description}</p>

              <h2 className="text-warning fw-bold">
                {Number(produit.produit_prix).toLocaleString('fr-FR')} Ar
              </h2>
              <p className="text-muted small">📍 Fournisseur : {produit.produit_lieu}</p>

              {/* --- Quantité --- */}
              <div className="d-flex align-items-center gap-2 my-3">
                <span>Quantité :</span>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  style={{ width: 90 }}
                  value={quantite}
                  onChange={(e) => setQuantite(Math.max(1, parseInt(e.target.value) || 1))}
                />
                <span className="text-muted">= {prixTotal.toLocaleString('fr-FR')} Ar</span>
              </div>

              {/* --- Actions --- */}
              <div className="d-flex gap-2 flex-wrap">
                <button
                  className="btn btn-warning btn-lg fw-bold"
                  onClick={() => {
                    addToCart({
                      id: produit.id,
                      nom: produit.produit_nom,
                      prix: Number(produit.produit_prix),
                      image: produit.produit_image,
                    }, quantite);
                    navigate('/commande');
                  }}
                >
                  🛒 Commander
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    addToCart({
                      id: produit.id,
                      nom: produit.produit_nom,
                      prix: Number(produit.produit_prix),
                      image: produit.produit_image,
                    }, quantite);
                  }}
                >
                  ➕ Ajouter au panier
                </button>
                <a
                  className="btn btn-success"
                  target="_blank"
                  rel="noreferrer"
                  href={`https://wa.me/2613403737179?text=${encodeURIComponent(
                    `Bonjour, je suis intéressé par : ${produit.produit_nom} (${Number(produit.produit_prix).toLocaleString('fr-FR')} Ar)`,
                  )}`}
                >
                  💬 Poser une question (WhatsApp)
                </a>
              </div>

              {/* --- Réassurance --- */}
              <hr />
              <div className="row text-center small text-muted mt-3">
                <div className="col-4">🚚 Livraison<br />nationale & internationale</div>
                <div className="col-4">💳 Paiement<br />Mobile Money · Banque · PayPal</div>
                <div className="col-4">🧾 Facture<br />email · WhatsApp · SMS</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduit;
