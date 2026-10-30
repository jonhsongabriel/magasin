// src/pages/Panier.js — Panier + checkout avec tous les modes de paiement
// Importation des modules
import React, { useState } from 'react';
import { useCart } from '../CartContext';
import jonhsonLogo from '../assets/jonhson-magasin.jpg';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const MODES_PAIEMENT = [
  { value: 'mvola', label: '📱 MVola (Telma)' },
  { value: 'orange_money', label: '🍊 Orange Money' },
  { value: 'airtel_money', label: '🔴 Airtel Money' },
  { value: 'carte_bancaire', label: '💳 Carte bancaire (Visa, Mastercard)' },
  { value: 'paypal', label: '🅿️ PayPal' },
  { value: 'virement', label: '🏦 Virement bancaire' },
  { value: 'especes', label: '💵 Espèces à la livraison' },
];

// Modes qui nécessitent une référence / numéro de transaction
const MODES_AVEC_REFERENCE = [
  'mvola', 'orange_money', 'airtel_money', 'carte_bancaire', 'paypal',
];

// Placeholder dynamique selon le mode choisi
const placeholderReference = (mode) => {
  switch (mode) {
    case 'mvola':
    case 'orange_money':
    case 'airtel_money':
      return 'Numéro Mobile Money utilisé (ex: 034 12 345 67) *';
    case 'carte_bancaire':
      return '4 derniers chiffres de la carte *';
    case 'paypal':
      return 'Email de votre compte PayPal *';
    default:
      return 'Référence *';
  }
};

const Panier = () => {
  const { cart, removeFromCart, changeQuantity, clearCart } = useCart();
  const [client, setClient] = useState({ nom: '', email: '', adresse: '', telephone: '' });
  const [modePaiement, setModePaiement] = useState('');
  const [paiementDetails, setPaiementDetails] = useState({ reference: '', note: '' });
  const [message, setMessage] = useState('');
  const [commandeConfirmee, setCommandeConfirmee] = useState(null);
  const [envoi, setEnvoi] = useState(false);

  const total = cart.reduce(
    (sum, article) => sum + (Number(article.prix) || 0) * (article.quantite || 1),
    0,
  );

  const validerClient = () =>
    client.nom && client.email && client.adresse && client.telephone;

  const validerPaiement = () => {
    if (!modePaiement) return false;
    if (MODES_AVEC_REFERENCE.includes(modePaiement) && !paiementDetails.reference) return false;
    return true;
  };

  const envoyerCommande = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validerClient()) {
      setMessage('Veuillez compléter toutes vos informations client.');
      return;
    }
    if (!validerPaiement()) {
      setMessage('Veuillez sélectionner et compléter le mode de paiement.');
      return;
    }

    setEnvoi(true);
    try {
      const response = await fetch(API_URL + '/api/commandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client,
          articles: cart.map((a) => ({
            id: a.id,
            nom: a.nom,
            prix: a.prix,
            quantite: a.quantite || 1,
          })),
          total,
          mode_paiement: modePaiement,
          paiement_details: paiementDetails,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setCommandeConfirmee(data.commande);
        clearCart();
        setMessage(data.message || 'Commande enregistrée avec succès.');
      } else {
        setMessage(data.message || 'Erreur lors de la commande.');
      }
    } catch (err) {
      setMessage('Serveur backend injoignable (http://localhost:5000).');
    } finally {
      setEnvoi(false);
    }
  };

  if (commandeConfirmee) {
    return (
      <div className="container my-5">
        <div className="card shadow-lg mx-auto" style={{ maxWidth: 640 }}>
          <div className="card-body text-center p-5">
            <img src={jonhsonLogo} alt="Jonhson" style={{ width: 120 }} />
            <h2 className="mt-3 text-success">✅ Commande confirmée</h2>
            <p className="text-muted">
              Merci {commandeConfirmee.client.nom} ! Votre commande{' '}
              <strong>{commandeConfirmee.numero}</strong> a été enregistrée.
            </p>
            <ul className="list-group my-3">
              <li className="list-group-item d-flex justify-content-between">
                <span>Articles</span>
                <strong>{commandeConfirmee.articles.length}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Total</span>
                <strong>{commandeConfirmee.total} Ar</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Paiement</span>
                <strong>{commandeConfirmee.mode_paiement}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Statut</span>
                <span className="badge bg-warning text-dark">
                  {commandeConfirmee.statut}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>📧 Facture</span>
                <strong>Envoyée à {commandeConfirmee.client.email}</strong>
              </li>
            </ul>
            <button
              className="btn btn-outline-success"
              onClick={() => setCommandeConfirmee(null)}
            >
              Continuer mes achats
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container my-5 text-center">
        <img src={jonhsonLogo} alt="Jonhson" style={{ width: 140 }} />
        <h2 className="mt-3">🛒 Votre panier est vide</h2>
        <p className="text-muted">Découvrez nos produits et ajoutez-les au panier.</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">🛒 Mon panier ({cart.length} articles)</h2>

      <div className="row">
        <div className="col-md-7">
          {cart.map((article) => (
            <div className="card mb-3" key={article.id}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">{article.nom}</h5>
                  <p className="text-muted mb-0">{article.prix} Ar</p>
                </div>
                <div className="d-flex align-items-center">
                  <input
                    type="number"
                    min="1"
                    value={article.quantite || 1}
                    onChange={(e) =>
                      changeQuantity(article.id, parseInt(e.target.value) || 1)
                    }
                    style={{ width: 64 }}
                    className="form-control me-2"
                  />
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeFromCart(article.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body">
              <h4 className="card-title">📋 Informations client</h4>
              <form onSubmit={envoyerCommande}>
                <input
                  className="form-control mb-2"
                  placeholder="Nom complet *"
                  value={client.nom}
                  onChange={(e) => setClient({ ...client, nom: e.target.value })}
                  required
                />
                <input
                  className="form-control mb-2"
                  type="email"
                  placeholder="Email *"
                  value={client.email}
                  onChange={(e) => setClient({ ...client, email: e.target.value })}
                  required
                />
                <input
                  className="form-control mb-2"
                  placeholder="Adresse de livraison *"
                  value={client.adresse}
                  onChange={(e) => setClient({ ...client, adresse: e.target.value })}
                  required
                />
                <input
                  className="form-control mb-3"
                  placeholder="Téléphone *"
                  value={client.telephone}
                  onChange={(e) => setClient({ ...client, telephone: e.target.value })}
                  required
                />

                <h4 className="card-title">💳 Mode de paiement</h4>
                <select
                  className="form-select mb-2"
                  value={modePaiement}
                  onChange={(e) => setModePaiement(e.target.value)}
                  required
                >
                  <option value="">Sélectionner…</option>
                  {MODES_PAIEMENT.map((mode) => (
                    <option key={mode.value} value={mode.value}>
                      {mode.label}
                    </option>
                  ))}
                </select>

                {MODES_AVEC_REFERENCE.includes(modePaiement) && (
                  <input
                    className="form-control mb-2"
                    placeholder={placeholderReference(modePaiement)}
                    value={paiementDetails.reference}
                    onChange={(e) =>
                      setPaiementDetails({ ...paiementDetails, reference: e.target.value })
                    }
                    required
                  />
                )}

                <textarea
                  className="form-control mb-3"
                  placeholder="Note (optionnel)"
                  value={paiementDetails.note}
                  onChange={(e) =>
                    setPaiementDetails({ ...paiementDetails, note: e.target.value })
                  }
                />

                <div className="d-flex justify-content-between fs-4 mb-3">
                  <span>Total</span>
                  <strong className="text-success">{total} Ar</strong>
                </div>

                {message && <div className="alert alert-warning">{message}</div>}

                <button
                  className="btn btn-success w-100"
                  disabled={envoi}
                >
                  {envoi ? 'Envoi…' : `Commander (${total} Ar)`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Panier;


