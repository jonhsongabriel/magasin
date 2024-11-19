// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white  p-4  ">
      <div className='row text-center container'>
        <div className='col-md-4'>
            <div className='text-danger'>
               <Link className="nav-Link text-danger" to="Action/AjoutProduit">Ajouter produit</Link>
            </div>
        </div>
        <div className='col-md-4'>
            <div className='text-danger'>
               <Link className="nav-Link text-danger" to="Membre/Inscription">S'incrire</Link>
            </div>
        </div>
        <div className='col-md-4'>
             <div className='text-danger'>
               <Link className="nav-Link text-danger" to="Membre/Connection">S'indentifier</Link>
            </div>
        </div>
      </div>
      <div className='row container text-center'>
         <div className='col-md-4 '>
             <h2>Nos contact</h2>
              
                 <span className='d-block'>Tel: 034 37 371 79</span>
                 <span className='d-block'>Email: jonhsonratsimbaherison@gmail.com</span>
                 <span className='d-block'>Adresse: Antananarivo</span>
                 <span className='d-block'>Linkiden: Jonhson Gabriel</span>
                 <span className='d-block'>Facebook: Gaby-jonhson Mbelo </span>
              
         </div>
         <div className='col-md-4 '>
            <h2>Nos activité</h2>
            
                 <span className='d-block'>Vente des produit</span>
                 <span className='d-block'>Publicité</span>
                 <span className='d-block'>Location</span>
                 <span className='d-block'>Partage des information</span>
                 <span className='d-block'>Formation à distance </span>
              
         </div>
         <div className='col-md-4 '>
         <h2>Ou nous trouver</h2>
            
                 <span className='d-block'>Antananarivo</span>
                 <span className='d-block'>Fianarantsoa</span>
                 <span className='d-block'>Mahajanga</span>
                 <span className='d-block'>Toliara</span>
                 <span className='d-block'>Antsiranana </span>
                 <span className='d-block'>Tamatavy </span>
              
         </div>
      </div>
    </footer>
  );
};

export default Footer;
