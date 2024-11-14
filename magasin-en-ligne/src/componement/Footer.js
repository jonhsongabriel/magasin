// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white  p-4 text-center">
      <div className='row container '>
         <div className='col-md-4 text-end'>
             <h2>Nos contact</h2>
              <ul>
                <li>Tel: 034 37 371 79</li>
                <li>Email: jonhsonratsimbaherison@gmail.com</li>
                <li>Adresse: Antananarivo</li>
                <li>Linkiden: Jonhson Gabriel</li>
                <li>Facebook: Gaby-jonhson Mbelo </li>
              </ul>
         </div>
         <div className='col-md-4 text-end'>
            <h2>Nos activité</h2>
            <ul>
                <li>Vente des produit</li>
                <li>Publicité</li>
                <li>Location</li>
                <li>Partage des information</li>
                <li>Formation à distance </li>
              </ul>
         </div>
         <div className='col-md-4 text-end'>
         <h2>Ou nous trouver</h2>
            <ul>
                <li>Antananarivo</li>
                <li>Fianarantsoa</li>
                <li>Mahajanga</li>
                <li>Toliara</li>
                <li>Antsiranana </li>
                <li>Tamatavy </li>
              </ul>
         </div>
      </div>
    </footer>
  );
};

export default Footer;
