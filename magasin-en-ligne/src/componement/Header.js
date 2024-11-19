// src/componement/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import jonhsonLogo from '../assets/jonhson-logo.jpg';


const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-danger text-white">
      <div className="container-fluid">
        <Link className="navbar-brand" aria-current="page" to="/">
            <img src={jonhsonLogo} alt='Jonhson Logo' style={{width:100 ,}} />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 row">
            <li className="nav-item col-md">
              <Link className="nav-Link text-white active" aria-current="page" to="pages/Apropos">A propos </Link>
            </li>
            <li className="nav-item dropdown col-md">
              <a className="nav-Link text-white dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Produit
              </a>
              <ul className="dropdown-menu  bg-primary dropdown-item-custom text-center">
                <li><Link className="dropdown-item text-white " to="pages/Tech">Technologique</Link></li>
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
              <ul className="dropdown-menu  bg-primary text-center">
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
