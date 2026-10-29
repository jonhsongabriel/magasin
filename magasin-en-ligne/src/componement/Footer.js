import React from 'react';
import { Link } from 'react-router-dom';
import jonhsonLogo from '../assets/jonhson-magasin.jpg';
import { useLang } from '../LangContext';

const Footer = () => {
  const { t } = useLang();
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* --- Marque --- */}
        <div className="footer-brand">
          <img src={jonhsonLogo} alt="Jonhson Magasin" />
          <h3>Jonhson Magasin</h3>
        </div>

        {/* --- Colonnes --- */}
        <div className="footer-columns">
          <div>
            <h4>{t('nos_contacts')}</h4>
            <span className="d-block">📞 Tel : 034 37 371 79</span>
            <a href="mailto:jonhsonratsimbaherison@gmail.com">✉️ jonhsonratsimbaherison@gmail.com</a>
            <span className="d-block">📍 Antananarivo, Madagascar</span>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">💼 LinkedIn : Jonhson Gabriel</a>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer">📘 Facebook : Gaby-jonhson Mbelo</a>
          </div>

          <div>
            <h4>{t('nos_activites')}</h4>
            <span className="d-block">🛍️ {t('vente_produits')}</span>
            <span className="d-block">📣 {t('publicite')}</span>
            <span className="d-block">🔑 {t('location')}</span>
            <span className="d-block">📚 {t('partage_info')}</span>
            <span className="d-block">🎓 {t('formation')}</span>
          </div>

          <div>
            <h4>{t('nos_produits')}</h4>
            <Link to="pages/Tech">{t('technologique')}</Link>
            <Link to="pages/Aliment">{t('alimentaire')}</Link>
            <Link to="pages/Construction">{t('construction')}</Link>
            <Link to="pages/Mode">{t('mode')}</Link>
            <Link to="pages/Mecanique">{t('mecanique')}</Link>
            <Link to="pages/Medicale">{t('medicale')}</Link>
          </div>

          <div>
            <h4>{t('ou_nous_trouver')}</h4>
            <Link to="pages/Antananarivo">Antananarivo</Link>
            <Link to="pages/Fianarantsoa">Fianarantsoa</Link>
            <Link to="pages/Mahajanga">Mahajanga</Link>
            <Link to="pages/Toliara">Toliara</Link>
            <Link to="pages/Antsiranana">Antsiranana</Link>
            <Link to="pages/Tamatave">Tamatavy</Link>
          </div>

          <div>
            <h4>{t('mon_compte')}</h4>
            <Link to="Membre/Connection">🔐 {t('s_identifier')}</Link>
            <Link to="Membre/ListeMembres">👥 {t('liste_membres')}</Link>
            <Link to="/admin">⚙️ {t('espace_admin')}</Link>
          </div>
        </div>

        {/* --- Ligne du bas --- */}
        <div className="footer-bottom">
          © {new Date().getFullYear()} <strong>Jonhson Magasin</strong> — {t('droits')} · Antananarivo, Madagascar
        </div>
      </div>
    </footer>
  );
};

export default Footer;
