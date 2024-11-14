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
import Construction from './pages/Contsruction';
import Exportation from './pages/Fianarantsoa';
import Fianarantsoa from './pages/Antananarivo';
import Grossiste from './pages/Grossiste';
import Impotation from './pages/Importation';
import Magasin from './pages/Magasin';
import Mahajanga from './pages/Mahajanga';
import Mecanique from './pages/Mecanique';
import Medicale from './pages/Medicale';
import Mode from './pages/Mode';
import Personnel from './pages/Personnel';
import Shop from './pages/Shop';
import Tamatave from './pages/Tamatave';
import Tech from './pages/Tech';
import Toliara from './pages/Toliara';

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

          {/* Pages supplémentaires */}
          <Route path="/pages/aliment" element={<Aliment />} />
          <Route path="/pages/antananarivo" element={<Antananarivo />} />
          <Route path="/pages/antsiranana" element={<Antsiranana />} />
          <Route path="/pages/apropos" element={<Apropos />} />
          <Route path="/pages/construction" element={<Construction />} />
          <Route path="/pages/exportation" element={<Exportation />} />
          <Route path="/pages/fianarantsoa" element={<Fianarantsoa />} />
          <Route path="/pages/grossiste" element={<Grossiste />} />
          <Route path="/pages/importation" element={<Impotation />} />
          <Route path="/pages/magasin" element={<Magasin />} />
          <Route path="/pages/mahajanga" element={<Mahajanga />} />
          <Route path="/pages/mecanique" element={<Mecanique />} />
          <Route path="/pages/medicale" element={<Medicale />} />
          <Route path="/pages/mode" element={<Mode />} />
          <Route path="/pages/personnel" element={<Personnel />} />
          <Route path="/pages/shop" element={<Shop />} />
          <Route path="/pages/tamatave" element={<Tamatave />} />
          <Route path="/pages/tech" element={<Tech />} />
          <Route path="/pages/toliara" element={<Toliara />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
