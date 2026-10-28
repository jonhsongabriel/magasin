// src/pages/CommandeConfirmation.js — Confirmation après checkout
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const CommandeConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const commande = location.state?.commande || null;

  useEffect(() => {
    if (!commande) {
      navigate('/commande');
      return;
    }
    // Retour automatique à la boutique après 30 secondes.
    const timer = setTimeout(() => navigate('/'), 30000);
    return () => clearTimeout(timer);
  }, [commande, navigate]);

  if (!commande) {
    return null;
  }

  return (
    <div className="container mt-4 text-center">
      <h1 className="text-success">🎉 Commande enregistrée !</h1>
      <p className="lead">
        Votre commande <strong>{commande.numero || commande.id}</strong> a été
        enregistrée avec succès.
      </p>
      <div className="card shadow-sm mx-auto" style={{ maxWidth: 520 }}>
        <div className="card-header bg-light">
          <strong>Détails de la commande</strong>
        </div>
        <div className="card-body text-start">
          {commande.client && (
            <div>
              <h6>Client</h6>
              <p className="text-start">
                {commande.client.nom} {commande.client.prenom}
                <br />
                {commande.client.email}
                <br />
                {commande.client.telephone}
                <br />
                {commande.client.adresse}, {commande.client.ville}
              </p>
            </div>
          )}
          {commande.articles && (
            <div>
              <h6>Articles</h6>
              <div className="text-start">
                {commande.articles.map((article) => (
                  <div
                    className="d-flex justify-content-between border-bottom py-2"
                    key={article.id}
                  >
                    <span>
                      {article.nom} × {article.quantite}
                    </span>
                    <span>
                      {(article.prix * article.quantite).toLocaleString('fr-FR')} Ar
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {commande.mode_paiement && (
            <div className="mt-2">
              <h6>Mode de paiement</h6>
              <p className="text-start">{commande.mode_paiement}</p>
            </div>
          )}
          {commande.total && (
            <div className="mt-2">
              <h6>Total</h6>
              <h4 className="text-success">
                {Number(commande.total).toLocaleString('fr-FR')} Ariary
              </h4>
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 d-flex gap-2 justify-content-center">
        <Link to="/" className="btn btn-outline-secondary">
          ← Retour à la boutique
        </Link>
      </div>
    </div>
  );
};

export default CommandeConfirmation;
