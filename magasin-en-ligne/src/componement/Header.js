import React, { useContext, useState } from 'react'; // Importation des hooks React
import { Link } from 'react-router-dom';
import jonhsonLogo from '../assets/jonhson-logo.jpg';
import { SearchContext } from '../SearchContext';

const Header = () => {
  const { handleSearch } = useContext(SearchContext); // Utilisation du contexte
  
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
    <nav className="navbar navbar-expand-lg bg-danger text-white">
      <div className="container-fluid">
        <Link className="navbar-brand" aria-current="page" to="/">
          <img src={jonhsonLogo} alt="Jonhson Logo" style={{ width: 100 }} />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 row">
            <li className="nav-item col-md">
              <Link className="nav-Link text-white active" aria-current="page" to="pages/Apropos">A propos</Link>
            </li>
            <li className="nav-item dropdown col-md">
              <a className="nav-Link text-white dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Produit
              </a>
              <ul className="dropdown-menu bg-primary dropdown-item-custom text-center">
                <li><Link className="dropdown-item text-white" to="pages/Tech">Technologique</Link></li>
                <li><Link className="dropdown-item text-white" to="pages/Aliment">Alimentaire</Link></li>
                <li><Link className="dropdown-item text-white" to="pages/Construction">Construction</Link></li>
                <li><Link className="dropdown-item text-white" to="pages/Mode">Mode</Link></li>
                <li><Link className="dropdown-item text-white" to="pages/Mecanique">Mecanique</Link></li>
                <li><Link className="dropdown-item text-white" to="pages/Medicale">Medicale</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown col-md">
              <a className="nav-Link text-white dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Contact
              </a>
              <ul className="dropdown-menu bg-primary text-center">
                <li><Link className="dropdown-item text-white" to="pages/Antananarivo">Antananarivo</Link></li>
                <li><Link className="dropdown-item text-white" to="pages/Fianarantsoa">Fianarantsoa</Link></li>
                <li><Link className="dropdown-item text-white" to="pages/Antsiranana">Antsiranana</Link></li>
                <li><Link className="dropdown-item text-white" to="pages/Mahajanga">Mahajanga</Link></li>
                <li><Link className="dropdown-item text-white" to="pages/Toliara">Toliara</Link></li>
                <li><Link className="dropdown-item text-white" to="pages/Tamatave">Tamatavy</Link></li>
              </ul>
            </li>
            <li className="nav-item col-md">
              <Link className="nav-Link text-white" to="pages/Partenaire">Partenaire</Link>
            </li>
            <li className="nav-item col-md">
              <Link className="nav-Link text-white" to="Membre/Inscription">Inscription</Link>
            </li>
            <li className="nav-item col-md">
              <Link className="nav-Link text-white" to="Membre/Connection">Connection</Link>
            </li>
            <li className="nav-item col-md">
              <Link className="nav-Link text-white" to="Membre/ListeMembres">Membres</Link>
            </li>
          </ul>
          <form onSubmit={handleSearchSubmit} className='d-flex'>
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Rechercher..."
              className='form-contrlo me-2'
            />
            <button type="submit" className='btn btn-success btn btn-outline-danger text-white border'>Chercher</button>
          </form>
          
        </div>
      </div>
    </nav>
  );
};

export default Header;
