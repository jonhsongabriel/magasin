import React, { useContext, useState } from 'react'; // Importation des hooks React
import { Link } from 'react-router-dom';
import jonhsonLogo from '../assets/jonhson-magasin.jpg';
import { SearchContext } from '../SearchContext';
import { useCart } from '../CartContext';
import { useLang } from '../LangContext';

const Header = () => {
  const { handleSearch } = useContext(SearchContext); // Utilisation du contexte
  const { count } = useCart(); // Nombre d'articles dans le panier
  const { langue, setLangue, t } = useLang(); // Langue active
  
  const [searchQuery, setSearchQuery] = useState(''); // Déclaration d'un état local
  
  if (!handleSearch) {
    console.error("SearchContext n'est pas disponible.");
    return null;
  }

  const changerLangue = (l) => setLangue(l);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value); // Mise à jour de l'état de recherche
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery); // Appel de la fonction contextuelle de recherche
  };

  return (
    <header className="site-header">
      {/* --- Ligne 1 : logo + recherche + actions --- */}
      <div className="header-top">
        <Link className="header-brand" to="/">
          <img src={jonhsonLogo} alt="Jonhson Magasin" />
        </Link>

        <form onSubmit={handleSearchSubmit} className="header-search">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder={t('rechercher')}
          />
          <button type="submit">{t('chercher')}</button>
        </form>

        <div className="header-actions">
          <div className="header-lang" role="group" aria-label="Langue">
            <button
              className={langue === 'mg' ? 'active' : ''}
              onClick={() => changerLangue('mg')}
              title="Malagasy"
            >
              🇲🇬 MG
            </button>
            <button
              className={langue === 'fr' ? 'active' : ''}
              onClick={() => changerLangue('fr')}
              title="Français"
            >
              🇫🇷 FR
            </button>
            <button
              className={langue === 'en' ? 'active' : ''}
              onClick={() => changerLangue('en')}
              title="English"
            >
              🇬🇧 EN
            </button>
          </div>
          <Link className="header-cart" to="Membre/Connection">{t('connection')}</Link>
          <Link className="header-cart" to="/panier">
            🛒 {t('panier')}{count > 0 && <span className="header-badge">{count}</span>}
          </Link>
        </div>
      </div>

      {/* --- Ligne 2 : navigation --- */}
      <nav className="header-nav">
        <ul>
          <li><Link to="pages/Apropos">{t('a_propos')}</Link></li>

          <li className="header-dropdown">
            <span className="nav-category dropdown-toggle">{t('produit')}</span>
            <ul className="dropdown-menu">
              <li><Link className="dropdown-item" to="pages/Tech">{t('technologique')}</Link></li>
              <li><Link className="dropdown-item" to="pages/Aliment">{t('alimentaire')}</Link></li>
              <li><Link className="dropdown-item" to="pages/Construction">{t('construction')}</Link></li>
              <li><Link className="dropdown-item" to="pages/Mode">{t('mode')}</Link></li>
              <li><Link className="dropdown-item" to="pages/Mecanique">{t('mecanique')}</Link></li>
              <li><Link className="dropdown-item" to="pages/Medicale">{t('medicale')}</Link></li>
            </ul>
          </li>

          <li className="header-dropdown">
            <span className="nav-category dropdown-toggle">Contact</span>
            <ul className="dropdown-menu">
              <li><Link className="dropdown-item" to="pages/Antananarivo">Antananarivo</Link></li>
              <li><Link className="dropdown-item" to="pages/Fianarantsoa">Fianarantsoa</Link></li>
              <li><Link className="dropdown-item" to="pages/Antsiranana">Antsiranana</Link></li>
              <li><Link className="dropdown-item" to="pages/Mahajanga">Mahajanga</Link></li>
              <li><Link className="dropdown-item" to="pages/Toliara">Toliara</Link></li>
              <li><Link className="dropdown-item" to="pages/Tamatave">Tamatavy</Link></li>
            </ul>
          </li>

          <li><Link to="pages/Partenaire">{t('partenaire')}</Link></li>
          <li><Link to="/locations">🔑 {t('location')}</Link></li>

          <li className="header-dropdown">
            <span className="nav-category dropdown-toggle">💼 {t('travail')}</span>
            <ul className="dropdown-menu">
              <li><Link className="dropdown-item" to="/travail/offres">📋 {t('offres_emploi')}</Link></li>
              <li><Link className="dropdown-item" to="/travail/chercher">👤 {t('chercher_emploi')}</Link></li>
            </ul>
          </li>

          <li className="header-dropdown">
            <span className="nav-category dropdown-toggle">{t('livraison')}</span>
            <ul className="dropdown-menu">
              <li><Link className="dropdown-item" to="/commande">{t('a_prendre')}</Link></li>
              <li><Link className="dropdown-item" to="/commande">{t('livreur_moto')}</Link></li>
              <li><Link className="dropdown-item" to="/commande">{t('bicyclette')}</Link></li>
              <li><Link className="dropdown-item" to="/commande">{t('personne')}</Link></li>
              <li><Link className="dropdown-item" to="/commande">{t('automobile')}</Link></li>
              <li><Link className="dropdown-item" to="/commande">{t('navire')}</Link></li>
              <li><Link className="dropdown-item" to="/commande">{t('avion')}</Link></li>
              <li><Link className="dropdown-item" to="/commande">{t('colis_express')}</Link></li>
              <li><Link className="dropdown-item" to="/commande">{t('autres_moyens')}</Link></li>
            </ul>
          </li>

          <li><Link to="Membre/Connection">{t('connection')}</Link></li>
          <li><Link to="Membre/ListeMembres">{t('membres')}</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

