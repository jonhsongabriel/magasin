// src/Membre/Connection.js — Connexion simple (4 champs) + Google
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../LangContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

const Connection = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', adresse: '' });
  const [message, setMessage] = useState('');
  const [envoi, setEnvoi] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Connexion classique (4 champs)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnvoi(true);
    setMessage('');
    try {
      const res = await fetch(`${API}/api/membres/connexion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('membre_token', data.token);
        localStorage.setItem('membre', JSON.stringify(data.membre));
        setMessage('✅ Connexion réussie, bienvenue ' + data.membre.nom + ' !');
        setTimeout(() => navigate('/'), 1200);
      } else {
        setMessage(data.message || 'Erreur de connexion.');
      }
    } catch {
      setMessage('Serveur backend injoignable.');
    } finally {
      setEnvoi(false);
    }
  };

  // Connexion Google — charge le script Google et affiche le bouton
  const initGoogle = () => {
    if (!GOOGLE_CLIENT_ID) {
      setMessage(
        "Google non configuré : ajoutez REACT_APP_GOOGLE_CLIENT_ID dans backend/.env (voir CONFIGURATION_BDD.md).",
      );
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            const res = await fetch(`${API}/api/auth/google`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ credential: response.credential }),
            });
            const data = await res.json();
            if (res.ok) {
              localStorage.setItem('membre_token', data.token);
              localStorage.setItem('membre', JSON.stringify(data.membre));
              setMessage('✅ Connecté avec Google : ' + data.membre.nom);
              setTimeout(() => navigate('/'), 1200);
            } else {
              setMessage(data.message || 'Connexion Google échouée.');
            }
          } catch {
            setMessage('Erreur lors de la connexion Google.');
          }
        },
      });
      window.google.accounts.id.renderButton(
        document.getElementById('btnGoogle'),
        { theme: 'outline', size: 'large', width: 320 },
      );
    };
    document.body.appendChild(script);
  };

  return (
    <div className="container my-5" style={{ maxWidth: 460 }}>
      <div className="card shadow">
        <div className="card-body p-4">
          <h2 className="text-center mb-3">🔐 {t('connexion_titre')}</h2>
          <p className="text-muted text-center small">{t('connexion_sous_titre')}</p>

          <form onSubmit={handleSubmit}>
            <input
              className="form-control mb-2"
              name="nom"
              placeholder={t('nom_complet')}
              value={form.nom}
              onChange={handleChange}
              required
            />
            <input
              className="form-control mb-2"
              type="email"
              name="email"
              placeholder={t('email')}
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              className="form-control mb-2"
              name="telephone"
              placeholder={t('telephone')}
              value={form.telephone}
              onChange={handleChange}
            />
            <input
              className="form-control mb-3"
              name="adresse"
              placeholder={t('adresse_livraison')}
              value={form.adresse}
              onChange={handleChange}
            />

            {message && <div className="alert alert-info py-2">{message}</div>}

            <button className="btn btn-warning w-100 fw-bold mb-3" disabled={envoi}>
              {envoi ? t('connexion_encours') : t('se_connecter')}
            </button>
          </form>

          <div className="text-center text-muted mb-2">{t('ou')}</div>
          <div id="btnGoogle" className="d-grid mb-2"></div>
          <button
            className="btn btn-outline-secondary w-100"
            onClick={initGoogle}
            type="button"
          >
            🇬 {t('google')}
          </button>

          <p className="text-muted text-center mt-3 mb-0" style={{ fontSize: 13 }}>
            {t('note_connexion')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Connection;

