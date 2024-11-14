// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Accueil from './Accueil'
import React from 'react';
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
import Grossite from './pages/Grossiste';
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
             <Route path="/" element={<Accueil />}/>
             <Route path="/Membre" element={<Connection />}/>
             <Route path="/Membre" element={<Inscription />}/>
             <Route path="/pages" element={<Aliment/>}/>
             <Route path="/pages" element={<Antananarivo />}/>
             <Route path="/pages" element={<Antsiranana />}/>
             <Route path="/pages" element={<Apropos />}/>
             <Route path="/pages" element={<Construction />}/>
             <Route path="/pages" element={<Exportation />}/>
             <Route path="/pages" element={<Fianarantsoa />}/>
             <Route path="/pages" element={<Grossite />}/>
             <Route path="/pages" element={<Impotation />}/>
             <Route path="/pages" element={<Magasin />}/>
             <Route path="/pages" element={<Mahajanga />}/>
             <Route path="/pages" element={<Mecanique />}/>
             <Route path="/pages" element={<Medicale />}/>
             <Route path="/pages" element={<Mode />}/>
             <Route path="/pages" element={<Personnel />}/>
             <Route path="/pages" element={<Shop />}/>
             <Route path="/pages" element={<Tamatave />}/>
             <Route path="/pages" element={<Tech />}/>
             <Route path="/pages" element={<Toliara />}/>
         </Routes>
         </Router> 
      <Footer />
    </div>
  );
}

export default App;
