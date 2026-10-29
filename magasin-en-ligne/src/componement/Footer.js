import React from 'react';
import { Link } from 'react-router-dom';
import jonhsonLogo from '../assets/jonhson-magasin.jpg';

const Footer = () => {
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
            <h4>Nos contacts</h4>
            <span className="d-block">📞 Tel : 034 37 371 79</span>
            <a href="mailto:jonhsonratsimbaherison@gmail.com">✉️ jonhsonratsimbaherison@gmail.com</a>
            <span className="d-block">📍 Antananarivo, Madagascar</span>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">💼 LinkedIn : Jonhson Gabriel</a>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer">📘 Facebook : Gaby-jonhson Mbelo</a>
          </div>

          <div>
            <h4>Nos activités</h4>
            <span className="d-block">🛍️ Vente des produits</span>
            <span className="d-block">📣 Publicité</span>
            <span className="d-block">🔑 Location</span>
            <span className="d-block">📚 Partage des informations</span>
            <span className="d-block">🎓 Formation à distance</span>
          </div>

          <div>
            <h4>Nos produits</h4>
            <Link to="pages/Tech">Technologique</Link>
            <Link to="pages/Aliment">Alimentaire</Link>
            <Link to="pages/Construction">Construction</Link>
            <Link to="pages/Mode">Mode</Link>
            <Link to="pages/Mecanique">Mecanique</Link>
            <Link to="pages/Medicale">Medicale</Link>
          </div>

          <div>
            <h4>Où nous trouver</h4>
            <Link to="pages/Antananarivo">Antananarivo</Link>
            <Link to="pages/Fianarantsoa">Fianarantsoa</Link>
            <Link to="pages/Mahajanga">Mahajanga</Link>
            <Link to="pages/Toliara">Toliara</Link>
            <Link to="pages/Antsiranana">Antsiranana</Link>
            <Link to="pages/Tamatave">Tamatavy</Link>
          </div>

          <div>
            <h4>Mon compte</h4>
            <Link to="Action/AjoutProduit">➕ Ajouter produit</Link>
            <Link to="Membre/Inscription">📝 S'inscrire</Link>
            <Link to="Membre/Connection">🔐 S'identifier</Link>
            <Link to="Membre/ListeMembres">👥 Liste des membres</Link>
          </div>
        </div>

        {/* --- Ligne du bas --- */}
        <div className="footer-bottom">
          © {new Date().getFullYear()} <strong>Jonhson Magasin</strong> — Tous droits réservés · Antananarivo, Madagascar
        </div>
      </div>
    </footer>
  );
};

export default Footer;
