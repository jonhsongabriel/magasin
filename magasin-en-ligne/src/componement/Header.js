// src/componement/Header.js
import React from 'react';
import { Link } from 'react-router-dom';


const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-danger text-white">
      <div className="container-fluid">
        <Link className="navbar-brand" aria-current="page" to="/">Accueil</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 row">
            <li className="nav-item col-md">
              <Link className="nav-Link text-white active" aria-current="page" to="/Apropos">A propos </Link>
            </li>
            <li className="nav-item dropdown col-md">
              <a className="nav-Link text-white dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Produit
              </a>
              <ul className="dropdown-menu  bg-primary dropdown-item-custom">
                <li><Link className="dropdown-item text-white " to="/Tech">Produit technologique</Link></li>
                <li><Link className="dropdown-item text-white" to="/Aliment">Produit alimentaire</Link></li>
                <li><Link className="dropdown-item text-white" to="/Contsruction">Produit de construction</Link></li>
                <li><Link className="dropdown-item text-white" to="/Mode">Produit de mode</Link></li>
                <li><Link className="dropdown-item text-white" to="/Mecanique">Produit mecanique</Link></li>
                <li><Link className="dropdown-item text-white" to="/Medicale">Produit de medicale</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown col-md">
              <a className="nav-Link text-white dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Contact
              </a>
              <ul className="dropdown-menu  bg-primary">
                <li><Link className="dropdown-item text-white" to="/Antananarivo">Antananarivo</Link></li>
                <li><Link className="dropdown-item text-white" to="/Fianarantsoa">Fianarantsoa</Link></li>
                <li><Link className="dropdown-item text-white" to="/Antsiranana">Antsiranana</Link></li>
                <li><Link className="dropdown-item text-white" to="/Mahajanga">Mahajanga</Link></li>
                <li><Link className="dropdown-item text-white" to="/Toliara">Toliara</Link></li>
                <li><Link className="dropdown-item text-white" to="Tamatave">Tamatavy</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown col-md">
              <a className="nav-Link text-white dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Partenaire
              </a>
              <ul className="dropdown-menu  bg-primary">
                <li><Link className="dropdown-item text-white" to="/Shop">Shop</Link></li>
                <li><Link className="dropdown-item text-white" to="/Grossiste">Grossite</Link></li>
                <li><Link className="dropdown-item text-white" to="Magasin">Magasin</Link></li>
                <li><Link className="dropdown-item text-white" to="/Personnel">Personnelle</Link></li>
                <li><Link className="dropdown-item text-white" to="/Importation">Imporatateur</Link></li>
                <li><Link className="dropdown-item text-white" to="/Exportation">Exportataire</Link></li>
              </ul>
            </li>
            <li className="nav-item col-md">
              <Link className="nav-Link text-white" to="/Inscription">Inscription</Link>
            </li>
            <li className="nav-item col-md">
              <Link className="nav-Link text-white" to="/Connection">Connection</Link>
            </li>
          </ul>
          <form className="d-flex" role="search">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Header;
