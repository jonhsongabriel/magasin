// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';

import Accueil from './Accueil';
import Header from './componement/Header';
import Footer from './componement/Footer';
import Connection from './Membre/Connection';
import Inscription from './Membre/Inscription';
import Aliment from './pages/Aliment';
import Antananarivo from './pages/Antananarivo';
import Antsiranana from './pages/Antsiranana';
import Apropos from './pages/Apropos';
import Construction from './pages/Construction';
import Fianarantsoa from './pages/Fianarantsoa';
import Exportation from './pages/Exportation';
import Impotation from './pages/Importation';
import Mahajanga from './pages/Mahajanga';
import Mecanique from './pages/Mecanique';
import Medicale from './pages/Medicale';
import Mode from './pages/Mode';
import Tamatave from './pages/Tamatave';
import Tech from './pages/Tech';
import Toliara from './pages/Toliara';
import ListeMembres from './Membre/ListeMembres';
import AjoutProduit from './Action/AjoutProduit';
import Partenaire from './pages/Partenaire';

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          {/* Routes principales */}
          <Route path="/" element={<Accueil />} />
          <Route path="/Membre/Connection" element={<Connection />} />
          <Route path="/Membre/Inscription" element={<Inscription />} />
          <Route path="/Membre/ListeMembres" element={<ListeMembres />} />

          {/* Pages supplémentaires */}
          <Route path="/pages/aliment" element={<Aliment />} />
          <Route path="/pages/partenaire" element={<Partenaire />} />
          <Route path="/pages/antananarivo" element={<Antananarivo />} />
          <Route path="/pages/antsiranana" element={<Antsiranana />} />
          <Route path="/pages/apropos" element={<Apropos />} />
          <Route path="/pages/construction" element={<Construction />} />
          <Route path="/pages/exportation" element={<Exportation />} />
          <Route path="/pages/fianarantsoa" element={<Fianarantsoa />} />
          <Route path="/pages/importation" element={<Impotation />} />
          <Route path="/pages/mahajanga" element={<Mahajanga />} />
          <Route path="/pages/mecanique" element={<Mecanique />} />
          <Route path="/pages/medicale" element={<Medicale />} />
          <Route path="/pages/mode" element={<Mode />} />
          <Route path="/pages/tamatave" element={<Tamatave />} />
          <Route path="/pages/tech" element={<Tech />} />
          <Route path="/pages/toliara" element={<Toliara />} />


          {/*Page pour des produit*/}
          <Route path='/Action/AjoutProduit' element={<AjoutProduit />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
