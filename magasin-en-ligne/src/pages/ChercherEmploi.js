// src/pages/ChercherEmploi.js — Section Travail : personnes qui cherchent un emploi
// Chacun peut publier son profil (+ CV). Les profils et CV sont ensuite gérés
// (modifiés / supprimés) uniquement par l'admin dans l'espace protégé.
import React, { useEffect, useState } from 'react';
import { useLang } from '../LangContext';

const API = 'http://localhost:5000';

const DOMAINES = ['BTP', 'Santé', 'Technologie', 'Commerce', 'Éducation', 'Transport', 'Agriculture', 'Autre'];
const VILLES = ['Antananarivo', 'Fianarantsoa', 'Mahajanga', 'Tamatave', 'Toliara', 'Antsiranana'];
const DISPONIBILITES = ['Immédiate', 'Sous 1 semaine', 'Sous 1 mois', 'À discuter'];

const PROFILS_INIT = {
  nom: '', prenom: '', email: '', telephone: '', ville: '', domaine: '',
  competences: '', experience: '', formation: '', langues: '', disponibilite: '',
  cv: null,
};

const ChercherEmploi = () => {
  const { t } = useLang();
  const [onglet, setOnglet] = useState('profils'); // 'profils' | 'deposer'
  const [candidats, setCandidats] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtreDomaine, setFiltreDomaine] = useState('');
  const [filtreVille, setFiltreVille] = useState('');
  const [recherche, setRecherche] = useState('');
  const [profilForm, setProfilForm] = useState(PROFILS_INIT);
  const [message, setMessage] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [profilChoisi, setProfilChoisi] = useState(null);

  const charger = async () => {
    setChargement(true);
    try {
      const params = new URLSearchParams();
      if (filtreDomaine) params.append('domaine', filtreDomaine);
      if (filtreVille) params.append('ville', filtreVille);
      if (recherche) params.append('search', recherche);
      const res = await fetch(`${API}/api/candidats?${params.toString()}`);
      const data = await res.json();
      setCandidats(data.candidats || []);
    } catch {
      setCandidats([]);
    }
    setChargement(false);
  };

  useEffect(() => {
    charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtreDomaine, filtreVille]);

  const majForm = (champ, valeur) => setProfilForm({ ...profilForm, [champ]: valeur });

  const deposerProfil = async (e) => {
    e.preventDefault();
    setEnvoi(true);
    setMessage('');
    const fd = new FormData();
    Object.entries(profilForm).forEach(([cle, val]) => {
      if (cle !== 'cv' && val) fd.append(cle, val);
    });
    if (profilForm.cv) fd.append('cv', profilForm.cv);
    try {
      const res = await fetch(`${API}/api/candidats`, { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        setMessage('✅ ' + t('travail_profil_ok'));
        setProfilForm(PROFILS_INIT);
        setOnglet('profils');
        charger();
      } else {
        setMessage(data.message || 'Erreur.');
      }
    } catch {
      setMessage(t('travail_serveur'));
    }
    setEnvoi(false);
  };

  const ICONES = {
    BTP: '🏗️', 'Santé': '⚕️', Technologie: '💻', Commerce: '🛒',
    'Éducation': '📚', Transport: '🚚', Agriculture: '🌾', Autre: '💼',
  };

  return (
    <div className="container my-5">
      <div className="text-center mb-4">
        <h2>👤 {t('travail_titre')}</h2>
        <p className="text-muted">{t('travail_sous_titre')}</p>
      </div>

      {/* --- Onglets --- */}
      <ul className="nav nav-tabs mb-4 justify-content-center">
        <li className="nav-item">
          <button className={`nav-link ${onglet === 'profils' ? 'active fw-bold' : ''}`} onClick={() => setOnglet('profils')}>
            👥 {t('travail_profils')}
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${onglet === 'deposer' ? 'active fw-bold' : ''}`} onClick={() => setOnglet('deposer')}>
            📄 {t('travail_deposer')}
          </button>
        </li>
      </ul>

      {message && <div className="alert alert-info">{message}</div>}

      {/* ---- Onglet : liste des profils ---- */}
      {onglet === 'profils' && (
        <>
          <div className="row g-2 mb-4">
            <div className="col-md-5">
              <input
                className="form-control"
                placeholder={t('travail_recherche')}
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && charger()}
              />
            </div>
            <div className="col-md-3">
              <select className="form-select" value={filtreDomaine} onChange={(e) => setFiltreDomaine(e.target.value)}>
                <option value="">— {t('travail_tous_domaines')} —</option>
                {DOMAINES.map((d) => <option key={d} value={d}>{ICONES[d]} {d}</option>)}
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

          {chargement ? (
            <p className="text-center text-muted py-5">{t('chargement')}</p>
          ) : candidats.length === 0 ? (
            <div className="alert alert-light border text-center">{t('travail_aucun_profil')}</div>
          ) : (
            <div className="row g-3">
              {candidats.map((c) => (
                <div className="col-md-6 col-lg-4" key={c.id}>
                  <div className="card h-100 shadow-sm candidat-card">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex align-items-center mb-2">
                        <div className="candidat-avatar">{(c.prenom || c.nom || '?').charAt(0).toUpperCase()}</div>
                        <div className="ms-3">
                          <h6 className="mb-0 fw-bold">{c.prenom ? `${c.prenom} ${c.nom}` : c.nom}</h6>
                          <small className="text-muted">{c.domaine || '—'}</small>
                        </div>
                      </div>
                      <ul className="list-unstyled small mb-3 flex-grow-1">
                        {c.ville && <li>📍 {c.ville}</li>}
                        {c.disponibilite && <li>🕒 {c.disponibilite}</li>}
                        {c.telephone && <li>📞 {c.telephone}</li>}
                        {c.competences && (
                          <li className="text-truncate">🛠️ {c.competences}</li>
                        )}
                      </ul>
                      <button className="btn btn-outline-warning fw-bold" onClick={() => setProfilChoisi(c)}>
                        {t('offres_voir_details')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ---- Onglet : déposer un profil / CV ---- */}
      {onglet === 'deposer' && (
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-warning bg-opacity-25">
                <strong>📄 {t('travail_deposer')}</strong>
              </div>
              <div className="card-body">
                <form onSubmit={deposerProfil}>
                  <div className="row">
                    <div className="col-md-6">
                      <input className="form-control mb-2" placeholder={t('travail_nom') + ' *'} value={profilForm.nom}
                        onChange={(e) => majForm('nom', e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <input className="form-control mb-2" placeholder={t('travail_prenom')} value={profilForm.prenom}
                        onChange={(e) => majForm('prenom', e.target.value)} />
                    </div>
                    <div className="col-md-6">
                      <input className="form-control mb-2" type="email" placeholder={t('email')} value={profilForm.email}
                        onChange={(e) => majForm('email', e.target.value)} />
                    </div>
                    <div className="col-md-6">
                      <input className="form-control mb-2" placeholder={t('telephone')} value={profilForm.telephone}
                        onChange={(e) => majForm('telephone', e.target.value)} />
                    </div>
                    <div className="col-md-6">
                      <select className="form-select mb-2" value={profilForm.ville} onChange={(e) => majForm('ville', e.target.value)}>
                        <option value="">— {t('offres_ville')} —</option>
                        {VILLES.map((v) => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <select className="form-select mb-2" value={profilForm.domaine} onChange={(e) => majForm('domaine', e.target.value)}>
                        <option value="">— {t('travail_domaine')} —</option>
                        {DOMAINES.map((d) => <option key={d} value={d}>{ICONES[d]} {d}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <input className="form-control mb-2" placeholder={t('travail_langues')} value={profilForm.langues}
                        onChange={(e) => majForm('langues', e.target.value)} />
                    </div>
                    <div className="col-md-6">
                      <select className="form-select mb-2" value={profilForm.disponibilite} onChange={(e) => majForm('disponibilite', e.target.value)}>
                        <option value="">— {t('travail_dispo')} —</option>
                        {DISPONIBILITES.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="col-12">
                      <textarea className="form-control mb-2" rows={2} placeholder={t('travail_competences')} value={profilForm.competences}
                        onChange={(e) => majForm('competences', e.target.value)} />
                    </div>
                    <div className="col-12">
                      <textarea className="form-control mb-2" rows={2} placeholder={t('travail_experience')} value={profilForm.experience}
                        onChange={(e) => majForm('experience', e.target.value)} />
                    </div>
                    <div className="col-12">
                      <textarea className="form-control mb-2" rows={2} placeholder={t('travail_formation')} value={profilForm.formation}
                        onChange={(e) => majForm('formation', e.target.value)} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small text-muted">{t('travail_cv')}</label>
                      <input className="form-control mb-3" type="file" accept=".pdf,.doc,.docx,.odt"
                        onChange={(e) => majForm('cv', e.target.files[0])} />
                    </div>
                  </div>
                  <button className="btn btn-warning w-100 fw-bold" disabled={envoi}>
                    {envoi ? t('chargement') : t('travail_envoyer')}
                  </button>
                  <p className="text-muted small mt-2 mb-0 text-center">{t('travail_note_admin')}</p>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Modale profil détaillé --- */}
      {profilChoisi && (
        <div className="offre-modal-overlay" onClick={() => setProfilChoisi(null)}>
          <div className="offre-modal card shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="card-header bg-warning bg-opacity-25 d-flex justify-content-between align-items-center">
              <strong>👤 {profilChoisi.prenom ? `${profilChoisi.prenom} ${profilChoisi.nom}` : profilChoisi.nom}</strong>
              <button className="btn-close" onClick={() => setProfilChoisi(null)} />
            </div>
            <div className="card-body">
              <table className="table table-sm">
                <tbody>
                  {profilChoisi.domaine && <tr><th>🏷️ {t('travail_domaine')}</th><td>{profilChoisi.domaine}</td></tr>}
                  {profilChoisi.ville && <tr><th>📍 {t('offres_ville')}</th><td>{profilChoisi.ville}</td></tr>}
                  {profilChoisi.disponibilite && <tr><th>🕒 {t('travail_dispo')}</th><td>{profilChoisi.disponibilite}</td></tr>}
                  {profilChoisi.langues && <tr><th>🌍 {t('travail_langues')}</th><td>{profilChoisi.langues}</td></tr>}
                  {profilChoisi.telephone && <tr><th>📞 {t('telephone')}</th><td>{profilChoisi.telephone}</td></tr>}
                  {profilChoisi.email && <tr><th>✉️ {t('email')}</th><td>{profilChoisi.email}</td></tr>}
                </tbody>
              </table>
              {profilChoisi.competences && (<><h6>🛠️ {t('travail_competences')}</h6><p className="small">{profilChoisi.competences}</p></>)}
              {profilChoisi.experience && (<><h6>💼 {t('travail_experience')}</h6><p className="small">{profilChoisi.experience}</p></>)}
              {profilChoisi.formation && (<><h6>📚 {t('travail_formation')}</h6><p className="small">{profilChoisi.formation}</p></>)}
              {profilChoisi.cv_nom && (
                <a className="btn btn-success" href={`${API}/api/candidats/cv/${profilChoisi.cv_nom}`}>
                  📥 {t('travail_telecharger_cv')}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChercherEmploi;
