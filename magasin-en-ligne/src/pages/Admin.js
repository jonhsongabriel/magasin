// src/pages/Admin.js — Espace admin : connexion + gestion produits & commandes
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:5000';

const Admin = () => {
  const navigate = useNavigate();
  const [connecte, setConnecte] = useState(false);
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [token, setToken] = useState('');
  const [onglet, setOnglet] = useState('produits'); // 'produits' | 'commandes' | 'livreurs'
  const [produits, setProduits] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [livreurs, setLivreurs] = useState([]);
  const [message, setMessage] = useState('');

  // Formulaire d'ajout livreur
  const [livreurForm, setLivreurForm] = useState({
    nom: '', prenom: '', telephone: '', email: '',
    type_vehicule: '', ville: '',
  });

  // Formulaire d'ajout produit
  const [form, setForm] = useState({
    produit_nom: '',
    produit_description: '',
    produit_prix: '',
    produit_type: '',
    produit_lieu: '',
    produit_image: null,
  });

  // Vérifier la session au chargement
  useEffect(() => {
    const saved = localStorage.getItem('admin_token');
    if (saved) {
      setToken(saved);
      setConnecte(true);
    }
  }, []);

  // Charger données après connexion
  useEffect(() => {
    if (connecte && token) {
      chargerProduits();
      chargerCommandes();
      chargerLivreurs();
    }
  }, [connecte, token]);

  const chargerProduits = async () => {
    try {
      const res = await fetch(`${API}/api/produits`);
      const data = await res.json();
      setProduits(data.produits || []);
    } catch {
      setMessage('Impossible de charger les produits.');
    }
  };

  const chargerCommandes = async () => {
    try {
      const res = await fetch(`${API}/api/commandes`);
      const data = await res.json();
      setCommandes(data.commandes || []);
    } catch {
      setMessage('Impossible de charger les commandes.');
    }
  };

  const chargerLivreurs = async () => {
    try {
      const res = await fetch(`${API}/api/livreurs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLivreurs(data.livreurs || []);
    } catch {
      setMessage('Impossible de charger les livreurs.');
    }
  };

  const connexion = async (e) => {
    e.preventDefault();
    setErreur('');
    try {
      const res = await fetch(`${API}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('admin_token', data.token);
        setToken(data.token);
        setConnecte(true);
      } else {
        setErreur(data.message || 'Mot de passe incorrect.');
      }
    } catch {
      setErreur('Serveur backend injoignable.');
    }
  };

  const deconnexion = () => {
    localStorage.removeItem('admin_token');
    setConnecte(false);
    setToken('');
  };

  const ajouterProduit = async (e) => {
    e.preventDefault();
    setMessage('');
    const fd = new FormData();
    fd.append('produit_nom', form.produit_nom);
    fd.append('produit_description', form.produit_description);
    fd.append('produit_prix', form.produit_prix);
    fd.append('produit_type', form.produit_type);
    fd.append('produit_lieu', form.produit_lieu);
    if (form.produit_image) fd.append('produit_image', form.produit_image);

    try {
      const res = await fetch(`${API}/api/action`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (res.ok) {
        setMessage('✅ Produit ajouté avec succès !');
        setForm({
          produit_nom: '',
          produit_description: '',
          produit_prix: '',
          produit_type: '',
          produit_lieu: '',
          produit_image: null,
        });
        chargerProduits();
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.message || 'Erreur lors de l’ajout.');
      }
    } catch {
      setMessage('Serveur backend injoignable.');
    }
  };

  const supprimerProduit = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    try {
      const res = await fetch(`${API}/api/action/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessage('🗑️ Produit supprimé.');
        chargerProduits();
      }
    } catch {
      setMessage('Erreur lors de la suppression.');
    }
  };

  const changerStatut = async (id, statut) => {
    try {
      const res = await fetch(`${API}/api/commandes/${id}/statut`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ statut }),
      });
      if (res.ok) {
        setMessage(`Statut de la commande #${id} mis à jour.`);
        chargerCommandes();
      }
    } catch {
      setMessage('Erreur lors de la mise à jour.');
    }
  };

  const ajouterLivreur = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(`${API}/api/livreurs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(livreurForm),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Livreur ajouté !');
        setLivreurForm({ nom: '', prenom: '', telephone: '', email: '', type_vehicule: '', ville: '' });
        chargerLivreurs();
      } else {
        setMessage(data.message || 'Erreur lors de l\'ajout.');
      }
    } catch {
      setMessage('Serveur backend injoignable.');
    }
  };

  const basculerDispo = async (liv) => {
    try {
      await fetch(`${API}/api/livreurs/${liv.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ disponible: !liv.disponible }),
      });
      chargerLivreurs();
    } catch {
      setMessage('Erreur lors de la mise à jour.');
    }
  };

  const supprimerLivreur = async (id) => {
    if (!window.confirm('Supprimer ce livreur ?')) return;
    try {
      await fetch(`${API}/api/livreurs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('🗑️ Livreur supprimé.');
      chargerLivreurs();
    } catch {
      setMessage('Erreur lors de la suppression.');
    }
  };

  /* ---------- Écran de connexion ---------- */
  if (!connecte) {
    return (
      <div className="container my-5" style={{ maxWidth: 420 }}>
        <div className="card shadow">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">🔐 Espace Admin</h2>
            <form onSubmit={connexion}>
              <input
                type="password"
                className="form-control mb-3"
                placeholder="Mot de passe admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
              />
              {erreur && <div className="alert alert-danger py-2">{erreur}</div>}
              <button className="btn btn-warning w-100 fw-bold">Se connecter</button>
            </form>
            <p className="text-muted text-center mt-3 mb-0" style={{ fontSize: 13 }}>
              Réservé au propriétaire du magasin.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Tableau de bord ---------- */
  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>⚙️ Espace Admin</h2>
        <button className="btn btn-outline-secondary btn-sm" onClick={deconnexion}>
          Déconnexion
        </button>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      {/* Onglets */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${onglet === 'produits' ? 'active' : ''}`}
            onClick={() => setOnglet('produits')}
          >
            📦 Produits ({produits.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${onglet === 'commandes' ? 'active' : ''}`}
            onClick={() => setOnglet('commandes')}
          >
            🧾 Commandes ({commandes.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${onglet === 'livreurs' ? 'active' : ''}`}
            onClick={() => setOnglet('livreurs')}
          >
            🚚 Livreurs ({livreurs.length})
          </button>
        </li>
      </ul>

      {/* ---- Onglet produits ---- */}
      {onglet === 'produits' && (
        <div className="row">
          <div className="col-lg-5 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-warning bg-opacity-25">
                <strong>➕ Ajouter un produit</strong>
              </div>
              <div className="card-body">
                <form onSubmit={ajouterProduit}>
                  <input
                    className="form-control mb-2"
                    placeholder="Nom du produit *"
                    value={form.produit_nom}
                    onChange={(e) => setForm({ ...form, produit_nom: e.target.value })}
                    required
                  />
                  <textarea
                    className="form-control mb-2"
                    placeholder="Description *"
                    rows={2}
                    value={form.produit_description}
                    onChange={(e) => setForm({ ...form, produit_description: e.target.value })}
                    required
                  />
                  <input
                    className="form-control mb-2"
                    type="number"
                    placeholder="Prix en Ariary *"
                    value={form.produit_prix}
                    onChange={(e) => setForm({ ...form, produit_prix: e.target.value })}
                    required
                  />
                  <select
                    className="form-select mb-2"
                    value={form.produit_type}
                    onChange={(e) => setForm({ ...form, produit_type: e.target.value })}
                    required
                  >
                    <option value="">-- Type de produit --</option>
                    <option value="Aliment">Alimentaire</option>
                    <option value="Construction">Construction</option>
                    <option value="Exportation">Exportation</option>
                    <option value="Importation">Importation</option>
                    <option value="Mecanique">Mecanique</option>
                    <option value="Medicale">Medicale</option>
                    <option value="Mode">Mode</option>
                    <option value="Tech">Tech</option>
                  </select>
                  <select
                    className="form-select mb-2"
                    value={form.produit_lieu}
                    onChange={(e) => setForm({ ...form, produit_lieu: e.target.value })}
                    required
                  >
                    <option value="">-- Ville / fournisseur --</option>
                    <option value="Antananarivo">Antananarivo</option>
                    <option value="Mahajanga">Mahajanga</option>
                    <option value="Fianarantsoa">Fianarantsoa</option>
                    <option value="Toliara">Toliara</option>
                    <option value="Antsiranana">Antsiranana</option>
                    <option value="Tamatave">Tamatave</option>
                  </select>
                  <input
                    className="form-control mb-3"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setForm({ ...form, produit_image: e.target.files[0] })}
                  />
                  <button className="btn btn-success w-100">Ajouter le produit</button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card shadow-sm">
              <div className="card-header">
                <strong>📦 Produits du magasin</strong>
              </div>
              <div className="card-body p-0">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Prix</th>
                      <th>Type</th>
                      <th>Ville</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {produits.map((p) => (
                      <tr key={p.id}>
                        <td>{p.produit_nom}</td>
                        <td>{Number(p.produit_prix).toLocaleString('fr-FR')} Ar</td>
                        <td><span className="badge bg-secondary">{p.produit_type}</span></td>
                        <td>{p.produit_lieu}</td>
                        <td>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => supprimerProduit(p.id)}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                    {produits.length === 0 && (
                      <tr><td colSpan={5} className="text-center text-muted py-4">Aucun produit.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Onglet livreurs ---- */}
      {onglet === 'livreurs' && (
        <div className="row">
          <div className="col-lg-5 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-info bg-opacity-25">
                <strong>🚚 Ajouter un livreur / coursier</strong>
              </div>
              <div className="card-body">
                <form onSubmit={ajouterLivreur}>
                  <input
                    className="form-control mb-2"
                    placeholder="Nom *"
                    value={livreurForm.nom}
                    onChange={(e) => setLivreurForm({ ...livreurForm, nom: e.target.value })}
                    required
                  />
                  <input
                    className="form-control mb-2"
                    placeholder="Prénom"
                    value={livreurForm.prenom}
                    onChange={(e) => setLivreurForm({ ...livreurForm, prenom: e.target.value })}
                  />
                  <input
                    className="form-control mb-2"
                    placeholder="Téléphone *"
                    value={livreurForm.telephone}
                    onChange={(e) => setLivreurForm({ ...livreurForm, telephone: e.target.value })}
                    required
                  />
                  <input
                    className="form-control mb-2"
                    type="email"
                    placeholder="Email"
                    value={livreurForm.email}
                    onChange={(e) => setLivreurForm({ ...livreurForm, email: e.target.value })}
                  />
                  <select
                    className="form-select mb-2"
                    value={livreurForm.type_vehicule}
                    onChange={(e) => setLivreurForm({ ...livreurForm, type_vehicule: e.target.value })}
                    required
                  >
                    <option value="">-- Moyen de livraison --</option>
                    <option value="moto">🏍️ Moto</option>
                    <option value="bicyclette">🚲 Bicyclette</option>
                    <option value="personne">🚶 À pied</option>
                    <option value="automobile">🚗 Automobile</option>
                    <option value="navire">🚢 Navire</option>
                    <option value="avion">✈️ Avion</option>
                    <option value="colis_express">📦 Colis express</option>
                    <option value="autres">📮 Autres</option>
                  </select>
                  <select
                    className="form-select mb-3"
                    value={livreurForm.ville}
                    onChange={(e) => setLivreurForm({ ...livreurForm, ville: e.target.value })}
                  >
                    <option value="">-- Ville d'opération --</option>
                    <option value="Antananarivo">Antananarivo</option>
                    <option value="Mahajanga">Mahajanga</option>
                    <option value="Fianarantsoa">Fianarantsoa</option>
                    <option value="Toliara">Toliara</option>
                    <option value="Antsiranana">Antsiranana</option>
                    <option value="Tamatave">Tamatave</option>
                  </select>
                  <button className="btn btn-info w-100 fw-bold">Ajouter le livreur</button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card shadow-sm">
              <div className="card-header"><strong>🚚 Équipe de livraison</strong></div>
              <div className="card-body p-0">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Contact</th>
                      <th>Moyen</th>
                      <th>Ville</th>
                      <th>Dispo</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {livreurs.map((liv) => (
                      <tr key={liv.id}>
                        <td>{liv.nom} {liv.prenom || ''}</td>
                        <td>{liv.telephone}</td>
                        <td>{liv.type_vehicule}</td>
                        <td>{liv.ville || '—'}</td>
                        <td>
                          <button
                            className={`btn btn-sm ${liv.disponible ? 'btn-success' : 'btn-secondary'}`}
                            onClick={() => basculerDispo(liv)}
                          >
                            {liv.disponible ? 'Oui' : 'Non'}
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => supprimerLivreur(liv.id)}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                    {livreurs.length === 0 && (
                      <tr><td colSpan={6} className="text-center text-muted py-4">Aucun livreur enregistré.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Onglet commandes ---- */}
      {onglet === 'commandes' && (
        <div className="card shadow-sm">
          <div className="card-header"><strong>🧾 Toutes les commandes</strong></div>
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Client</th>
                  <th>Total</th>
                  <th>Paiement</th>
                  <th>Livraison</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {commandes.map((c) => {
                  const client = typeof c.client_json === 'string'
                    ? JSON.parse(c.client_json)
                    : c.client_json || {};
                  const livraison = c.mode_livraison || 'a_prendre';
                  return (
                    <tr key={c.id}>
                      <td><strong>CMD-{c.id}</strong></td>
                      <td>{client.nom} {client.prenom || ''}<br />
                        <small className="text-muted">{client.email}</small></td>
                      <td>{Number(c.total).toLocaleString('fr-FR')} Ar</td>
                      <td>{c.mode_paiement}</td>
                      <td>{livraison}</td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={c.statut}
                          onChange={(e) => changerStatut(c.id, e.target.value)}
                        >
                          <option value="en_attente">en_attente</option>
                          <option value="payee">payée</option>
                          <option value="expediee">expédiée</option>
                          <option value="livree">livrée</option>
                          <option value="annulee">annulée</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
                {commandes.length === 0 && (
                  <tr><td colSpan={6} className="text-center text-muted py-4">Aucune commande.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
