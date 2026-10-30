// src/pages/OffresEmploi.js — Section Travail : toutes les offres d'emploi
// Les offres sont publiées uniquement par l'admin (mot de passe requis côté admin).
import React, { useEffect, useState } from 'react';
import { useLang } from '../LangContext';

const API = 'http://localhost:5000';

const CATEGORIES = ['BTP', 'Santé', 'Technologie', 'Commerce', 'Éducation', 'Transport', 'Agriculture', 'Autre'];
const VILLES = ['Antananarivo', 'Fianarantsoa', 'Mahajanga', 'Tamatave', 'Toliara', 'Antsiranana'];

const COULEURS_CONTRAT = {
  CDI: 'success',
  CDD: 'primary',
  Stage: 'info',
  Freelance: 'warning',
  Journalier: 'secondary',
};

const OffresEmploi = () => {
  const { t } = useLang();
  const [offres, setOffres] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtreCategorie, setFiltreCategorie] = useState('');
  const [filtreVille, setFiltreVille] = useState('');
  const [recherche, setRecherche] = useState('');
  const [offreChoisie, setOffreChoisie] = useState(null);

  const charger = async () => {
    setChargement(true);
    try {
      const params = new URLSearchParams();
      if (filtreCategorie) params.append('categorie', filtreCategorie);
      if (filtreVille) params.append('ville', filtreVille);
      if (recherche) params.append('search', recherche);
      const res = await fetch(`${API}/api/offres?${params.toString()}`);
      const data = await res.json();
      setOffres(data.offres || []);
    } catch {
      setOffres([]);
    }
    setChargement(false);
  };

  useEffect(() => {
    charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtreCategorie, filtreVille]);

  const ICONES = {
    BTP: '🏗️', 'Santé': '⚕️', Technologie: '💻', Commerce: '🛒',
    'Éducation': '📚', Transport: '🚚', Agriculture: '🌾', Autre: '💼',
  };

  return (
    <div className="container my-5">
      <div className="text-center mb-4">
        <h2>💼 {t('offres_titre')}</h2>
        <p className="text-muted">{t('offres_sous_titre')}</p>
      </div>

      {/* --- Filtres --- */}
      <div className="row g-2 mb-4">
        <div className="col-md-5">
          <input
            className="form-control"
            placeholder={t('offres_recherche')}
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && charger()}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={filtreCategorie} onChange={(e) => setFiltreCategorie(e.target.value)}>
            <option value="">— {t('offres_toutes_categories')} —</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{ICONES[c]} {c}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={filtreVille} onChange={(e) => setFiltreVille(e.target.value)}>
            <option value="">— {t('offres_toutes_villes')} —</option>
            {VILLES.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div className="col-md-1">
          <button className="btn btn-warning w-100" onClick={charger}>🔍</button>
        </div>
      </div>

      {/* --- Liste des offres --- */}
      {chargement ? (
        <p className="text-center text-muted py-5">{t('chargement')}</p>
      ) : offres.length === 0 ? (
        <div className="alert alert-light border text-center">
          {t('offres_aucune')}
        </div>
      ) : (
        <div className="row g-3">
          {offres.map((o) => (
            <div className="col-md-6 col-lg-4" key={o.id}>
              <div className="card h-100 shadow-sm offre-card">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span style={{ fontSize: 32 }}>{ICONES[o.categorie] || '💼'}</span>
                    {o.type_contrat && (
                      <span className={`badge bg-${COULEURS_CONTRAT[o.type_contrat] || 'secondary'}`}>
                        {o.type_contrat}
                      </span>
                    )}
                  </div>
                  <h5 className="card-title mb-1">{o.titre}</h5>
                  <h6 className="card-subtitle text-muted mb-2">{o.entreprise || '—'}</h6>
                  <p className="card-text small flex-grow-1">
                    {(o.description || '').length > 120
                      ? `${o.description.slice(0, 120)}…`
                      : o.description}
                  </p>
                  <ul className="list-unstyled small mb-3">
                    {o.ville && <li>📍 {o.ville}</li>}
                    {o.salaire && <li>💰 {o.salaire}</li>}
                    {o.categorie && <li>🏷️ {o.categorie}</li>}
                  </ul>
                  <button className="btn btn-warning fw-bold" onClick={() => setOffreChoisie(o)}>
                    {t('offres_voir_details')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Modale détails + contact --- */}
      {offreChoisie && (
        <div className="offre-modal-overlay" onClick={() => setOffreChoisie(null)}>
          <div className="offre-modal card shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="card-header bg-warning bg-opacity-25 d-flex justify-content-between align-items-center">
              <strong>{ICONES[offreChoisie.categorie] || '💼'} {offreChoisie.titre}</strong>
              <button className="btn-close" onClick={() => setOffreChoisie(null)} />
            </div>
            <div className="card-body">
              <h6 className="text-muted mb-3">{offreChoisie.entreprise}</h6>
              <table className="table table-sm">
                <tbody>
                  {offreChoisie.ville && <tr><th>📍 {t('offres_ville')}</th><td>{offreChoisie.ville}</td></tr>}
                  {offreChoisie.type_contrat && <tr><th>📄 {t('offres_contrat')}</th><td>{offreChoisie.type_contrat}</td></tr>}
                  {offreChoisie.salaire && <tr><th>💰 {t('offres_salaire')}</th><td>{offreChoisie.salaire}</td></tr>}
                  {offreChoisie.categorie && <tr><th>🏷️ {t('offres_categorie')}</th><td>{offreChoisie.categorie}</td></tr>}
                </tbody>
              </table>
              <h6>{t('offres_description')}</h6>
              <p className="small" style={{ whiteSpace: 'pre-line' }}>{offreChoisie.description || '—'}</p>
              {offreChoisie.contact && (
                <div className="alert alert-info py-2 mb-0">
                  <strong>📩 {t('offres_contact')} :</strong> {offreChoisie.contact}
                </div>
              )}
            </div>
            <div className="card-footer text-end">
              <a
                className="btn btn-success"
                href={offreChoisie.contact && offreChoisie.contact.includes('@')
                  ? `mailto:${offreChoisie.contact}`
                  : `tel:${offreChoisie.contact || ''}`}
              >
                {t('offres_postuler')}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffresEmploi;
