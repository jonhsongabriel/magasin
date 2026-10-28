// src/pages/Commande.js — Checkout avec tous les modes de paiement
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';

const MODES_PAIEMENT = [
  {
    id: 'carte',
    label: 'Carte bancaire (Visa / Mastercard)',
    glyph: '💳',
    details: ['Numéro de carte', 'Expiration (MM/AA)', 'CVC'],
  },
  {
    id: 'mvola',
    label: 'MVola',
    glyph: '📱',
    details: ['Numéro MVola (ex : 034 00 000 00)'],
  },
  {
    id: 'orange_money',
    label: 'Orange Money',
    glyph: '📱',
    details: ['Numéro Orange Money (ex : 032 00 000 00)'],
  },
  {
    id: 'airtel_money',
    label: 'Airtel Money',
    glyph: '📱',
    details: ['Numéro Airtel Money (ex : 033 00 000 00)'],
  },
  {
    id: 'virement',
    label: 'Virement bancaire',
    glyph: '🏦',
    details: ['Nom de la banque', 'Numéro de compte'],
  },
  {
    id: 'paypal',
    label: 'PayPal',
    glyph: '🅿️',
    details: ['Email PayPal'],
  },
  {
    id: 'especes',
    label: 'Espèces à la livraison',
    glyph: '💵',
    details: [],
  },
];

const Commande = () => {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: 'Antananarivo',
  });
  const [modePaiement, setModePaiement] = useState(null);
  const [paiementDetails, setPaiementDetails] = useState({});
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const modeActif = MODES_PAIEMENT.find((m) => m.id === modePaiement);

  if (cart.length === 0) {
    return (
      <div className="container mt-4 text-center">
        <h1 className="text-success">Finaliser la commande</h1>
        <p className="lead">Votre panier est vide — ajoutez des produits d'abord.</p>
        <Link to="/" className="btn btn-success">
          Retour à la boutique
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailChange = (label, value) => {
    setPaiementDetails((prev) => ({ ...prev, [label]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!modePaiement) {
      setError("Veuillez choisir un mode de paiement.");
      return;
    }
    for (const label of modeActif?.details || []) {
      if (!paiementDetails[label] || !paiementDetails[label].trim()) {
        setError(`Veuillez renseigner : ${label}`);
        return;
      }
    }

    setSending(true);
    try {
      const response = await fetch('http://localhost:5000/api/commandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: formData,
          articles: cart,
          total,
          mode_paiement: modePaiement,
          paiement_details: paiementDetails,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'enregistrement de la commande.");
      }
      clearCart();
      navigate('/commande/confirmation', { state: { commande: data.commande } });
    } catch (err) {
      setError(
        err.message ||
        'Impossible de contacter le serveur. Vérifiez que le backend est lancé (port 5000).',
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-success mb-4">Finaliser la commande</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-light">
            <strong>1. Vos coordonnées</strong>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nom *</label>
                <input
                  type="text"
                  name="nom"
                  className="form-control"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Prénom *</label>
                <input
                  type="text"
                  name="prenom"
                  className="form-control"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Téléphone *</label>
                <input
                  type="tel"
                  name="telephone"
                  className="form-control"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-8">
                <label className="form-label">Adresse de livraison *</label>
                <input
                  type="text"
                  name="adresse"
                  className="form-control"
                  value={formData.adresse}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Ville *</label>
                <select
                  name="ville"
                  className="form-select"
                  value={formData.ville}
                  onChange={handleChange}
                >
                  <option>Antananarivo</option>
                  <option>Fianarantsoa</option>
                  <option>Mahajanga</option>
                  <option>Tamatave</option>
                  <option>Toliara</option>
                  <option>Antsiranana</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-light">
            <strong>2. Mode de paiement</strong>
          </div>
          <div className="card-body">
            <div className="row g-2">
              {MODES_PAIEMENT.map((mode) => (
                <div className="col-md-6" key={mode.id}>
                  <label
                    className={`d-flex align-items-center gap-2 border rounded p-2 h-100 ${modePaiement === mode.id
                        ? 'border-success bg-success bg-opacity-10'
                        : ''
                      }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <input
                      type="radio"
                      name="modePaiement"
                      value={mode.id}
                      checked={modePaiement === mode.id}
                      onChange={() => setModePaiement(mode.id)}
                    />
                    <span>{mode.glyph}</span>
                    <span>{mode.label}</span>
                  </label>
                </div>
              ))}
            </div>

            {modeActif && modeActif.details.length > 0 && (
              <div className="mt-3">
                <h6>Détails du paiement — {modeActif.label}</h6>
                {modeActif.details.map((label) => (
                  <div className="mb-2" key={label}>
                    <label className="form-label">{label}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={paiementDetails[label] || ''}
                      onChange={(e) => handleDetailChange(label, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-light">
            <strong>3. Récapitulatif</strong>
          </div>
          <div className="card-body">
            {cart.map((it) => (
              <div
                key={it.id}
                className="d-flex justify-content-between border-bottom py-2"
              >
                <span>
                  {it.nom} × {it.quantite}
                </span>
                <span>{(it.prix * it.quantite).toLocaleString('fr-FR')} Ar</span>
              </div>
            ))}
            <div className="d-flex justify-content-between mt-3">
              <h4 className="text-success">Total à payer</h4>
              <h4 className="text-success">
                {total.toLocaleString('fr-FR')} Ariary
              </h4>
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 mb-4">
          <Link to="/panier" className="btn btn-outline-secondary">
            ← Retour au panier
          </Link>
          <button
            type="submit"
            className="btn btn-success btn-lg"
            disabled={sending}
          >
            {sending ? 'Envoi en cours…' : '✅ Confirmer et payer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Commande;
