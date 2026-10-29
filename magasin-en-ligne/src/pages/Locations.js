// src/pages/Locations.js — Section locations : maison, voiture, moto
// Tarification : par jour / par nuit / par mois / par an
import React, { useState } from 'react';
import { useRentals } from '../RentalContext';
import { useLang } from '../LangContext';

const BIENS = [
  {
    id: 'maison-1',
    type: 'maison',
    nom: 'Villa Andohavatenina — 3 chambres',
    lieu: 'Andohavatenina, Antananarivo',
    details: 'Villa moderne 3 chambres, salon, cuisine équipée, parking, jardin, sécurité 24h. Idéale famille.',
    images: '🏡',
  },
  {
    id: 'maison-2',
    type: 'maison',
    nom: 'Appartement Ambatoroka — F2',
    lieu: 'Ambatoroka, Antananarivo',
    details: 'Appartement F2 meublé, wifi, eau chaude, vue ville. Parfait couple ou étudiant.',
    images: '🏢',
  },
  {
    id: 'maison-3',
    type: 'maison',
    nom: 'Case Toamasina — bord de mer',
    lieu: 'Toamasina',
    details: 'Case traditionnelle bord de mer, 2 chambres, terrasse, accès plage privé.',
    images: '🏖️',
  },
  {
    id: 'voiture-1',
    type: 'voiture',
    nom: 'Toyota Vitz 2020',
    lieu: 'Antananarivo',
    details: 'Essence, boîte automatique, 5 places, clim, parfait en ville, conducteur optionnel.',
    images: '🚗',
  },
  {
    id: 'voiture-2',
    type: 'voiture',
    nom: 'Nissan Navara 4x4',
    lieu: 'Antananarivo',
    details: 'Diesel 4x4, double cabine, idéal piste et province, conducteur optionnel.',
    images: '🚙',
  },
  {
    id: 'moto-1',
    type: 'moto',
    nom: 'Honda CB125',
    lieu: 'Antananarivo',
    details: '125cc, essence, parfait en ville, casque fourni, 2 casques.',
    images: '🏍️',
  },
  {
    id: 'moto-2',
    type: 'moto',
    nom: 'Scooter Yamaha 110',
    lieu: 'Toamasina',
    details: '110cc automatique, idéale débutant, casque fourni.',
    images: '🛵',
  },
];

const DUREES = [
  { cle: 'jour', unite: 'jours' },
  { cle: 'nuit', unite: 'nuits' },
  { cle: 'mois', unite: 'mois' },
  { cle: 'an', unite: 'ans' },
];

const Locations = () => {
  const { addRental } = useRentals();
  const { t } = useLang();

  const [filtre, setFiltre] = useState('tous'); // tous / maison / voiture / moto
  const [dureeCle, setDureeCle] = useState('jour');
  const [dureeValeur, setDureeValeur] = useState(1);
  const [message, setMessage] = useState('');

  const biensFiltres = filtre === 'tous' ? BIENS : BIENS.filter((b) => b.type === filtre);

  const LABEL_DUREE = {
    jour: t('par_jour'),
    nuit: t('par_nuit'),
    mois: t('par_mois'),
    an: t('par_an'),
  };

  const UNITE = {
    jours: t('jours'),
    nuits: t('nuits'),
    mois: t('mois'),
    ans: t('ans'),
  };

  const TYPE_ICON = {
    maison: '🏡',
    voiture: '🚗',
    moto: '🏍️',
  };

  const reserver = (bien) => {
    addRental(bien.id, bien.type, bien.nom, dureeCle, dureeValeur);
    setMessage(
      `✅ ${bien.nom} réservé ${dureeValeur} ${UNITE[DUREES.find((d) => d.cle === dureeCle).unite]} — consultez votre panier.`,
    );
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">
        🔑 {t('location_titre')} <span className="text-muted small">{t('location')}</span>
      </h2>

      {/* --- Filtre par type --- */}
      <div className="btn-group mb-3" role="group">
        <button className={`btn ${filtre === 'tous' ? 'btn-warning' : 'btn-outline-secondary'}`} onClick={() => setFiltre('tous')}>
          🌐 Tous
        </button>
        <button className={`btn ${filtre === 'maison' ? 'btn-warning' : 'btn-outline-secondary'}`} onClick={() => setFiltre('maison')}>
          🏡 {t('maison')}
        </button>
        <button className={`btn ${filtre === 'voiture' ? 'btn-warning' : 'btn-outline-secondary'}`} onClick={() => setFiltre('voiture')}>
          🚗 {t('voiture')}
        </button>
        <button className={`btn ${filtre === 'moto' ? 'btn-warning' : 'btn-outline-secondary'}`} onClick={() => setFiltre('moto')}>
          🏍️ {t('moto')}
        </button>
      </div>

      {/* --- Choix de durée (s'applique à toutes les réservations) --- */}
      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex flex-wrap align-items-center gap-3">
          <span className="fw-bold">{t('duree')} :</span>
          {DUREES.map((d) => (
            <div className="form-check form-check-inline" key={d.cle}>
              <input
                className="form-check-input"
                type="radio"
                name="duree"
                id={`duree-${d.cle}`}
                checked={dureeCle === d.cle}
                onChange={() => {
                  setDureeCle(d.cle);
                  setDureeValeur(1);
                }}
              />
              <label className="form-check-label" htmlFor={`duree-${d.cle}`}>
                {LABEL_DUREE[d.cle]}
              </label>
            </div>
          ))}
          <div className="d-flex align-items-center gap-1">
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setDureeValeur((v) => Math.max(1, v - 1))}>−</button>
            <input
              type="number"
              className="form-control form-control-sm"
              style={{ width: 80 }}
              min="1"
              value={dureeValeur}
              onChange={(e) => setDureeValeur(Math.max(1, Number(e.target.value) || 1))}
            />
            <span className="text-muted small">{UNITE[DUREES.find((d) => d.cle === dureeCle).unite]}</span>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setDureeValeur((v) => v + 1)}>+</button>
          </div>
        </div>
      </div>

      {message && <div className="alert alert-info py-2">{message}</div>}

      {/* --- Liste des biens --- */}
      <div className="row">
        {biensFiltres.map((bien) => (
          <div className="col-md-6 col-lg-4 mb-4" key={bien.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-img-top text-center display-3 py-4 bg-light">{bien.images}</div>
              <div className="card-body">
                <h5 className="card-title">{bien.nom}</h5>
                <p className="text-muted small mb-1">📍 {bien.lieu}</p>
                <p className="text-muted small mb-2">{bien.details}</p>
                <p className="fw-bold mb-0">{TYPE_ICON[bien.type]} {LABEL_DUREE[dureeCle]}</p>
                <p className="text-muted small">{t('disponible')}</p>
                <button className="btn btn-warning w-100 fw-bold" onClick={() => reserver(bien)}>
                  🔑 {t('louer')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Locations;
