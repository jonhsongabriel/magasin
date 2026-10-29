import React, { useContext, useState } from 'react'; // Importation des hooks React
import { Link } from 'react-router-dom';
import jonhsonLogo from '../assets/jonhson-magasin.jpg';
import { SearchContext } from '../SearchContext';
import { useCart } from '../CartContext';

const Header = () => {
  const { handleSearch } = useContext(SearchContext); // Utilisation du contexte
  const { count } = useCart(); // Nombre d'articles dans le panier
  
  const [searchQuery, setSearchQuery] = useState(''); // Déclaration d'un état local
  
  if (!handleSearch) {
    console.error("SearchContext n'est pas disponible.");
    return null;
  }

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
            placeholder="Rechercher un produit, une marque..."
          />
          <button type="submit">Chercher</button>
        </form>

        <div className="header-actions">
          <Link className="header-cart" to="Membre/Connection">Connection</Link>
          <Link className="header-cart" to="/panier">
            🛒 Panier{count > 0 && <span className="header-badge">{count}</span>}
          </Link>
        </div>
      </div>

      {/* --- Ligne 2 : navigation --- */}
      <nav className="header-nav">
        <ul>
          <li><Link to="pages/Apropos">A propos</Link></li>

          <li className="header-dropdown">
            <span className="nav-category dropdown-toggle">Produit</span>
            <ul className="dropdown-menu">
              <li><Link className="dropdown-item" to="pages/Tech">Technologique</Link></li>
              <li><Link className="dropdown-item" to="pages/Aliment">Alimentaire</Link></li>
              <li><Link className="dropdown-item" to="pages/Construction">Construction</Link></li>
              <li><Link className="dropdown-item" to="pages/Mode">Mode</Link></li>
              <li><Link className="dropdown-item" to="pages/Mecanique">Mecanique</Link></li>
              <li><Link className="dropdown-item" to="pages/Medicale">Medicale</Link></li>
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

          <li><Link to="pages/Partenaire">Partenaire</Link></li>
          <li><Link to="Membre/Inscription">Inscription</Link></li>
          <li><Link to="Membre/ListeMembres">Membres</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
