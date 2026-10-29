// src/RentalContext.js — Panier de locations (maison / voiture / moto)
import React, { createContext, useContext, useState } from 'react';

const RentalContext = createContext();

// Tarifs indicatifs de base par type (Ar) — modifiables dans l'admin
const TARIFS_BASE = {
  maison: { jour: 50000, nuit: 40000, mois: 900000, an: 8000000 },
  voiture: { jour: 150000, nuit: 120000, mois: 2500000, an: 20000000 },
  moto: { jour: 30000, nuit: 25000, mois: 500000, an: 4000000 },
};

export const RentalProvider = ({ children }) => {
  const [locations, setLocations] = useState([]); // [{id, type, nom, duree_cle, duree_valeur, prix_unitaire, total}]

  // Ajouter une location
  const addRental = (id, type, nom, dureeCle, dureeValeur) => {
    setLocations((prev) => {
      const tarifs = TARIFS_BASE[type] || TARIFS_BASE.moto;
      const prixUnitaire = tarifs[dureeCle] || tarifs.jour;
      const total = prixUnitaire * (dureeValeur || 1);
      return [...prev, { id, type, nom, duree_cle: dureeCle, duree_valeur: dureeValeur, prix_unitaire: prixUnitaire, total }];
    });
  };

  // Supprimer une location
  const removeRental = (index) => {
    setLocations((prev) => prev.filter((_, i) => i !== index));
  };

  // Total global
  const grandTotal = locations.reduce((somme, loc) => somme + loc.total, 0);

  return (
    <RentalContext.Provider value={{ locations, addRental, removeRental, grandTotal }}>
      {children}
    </RentalContext.Provider>
  );
};

export const useRentals = () => {
  const ctx = useContext(RentalContext);
  if (!ctx) throw new Error('useRentals doit être utilisé dans un RentalProvider');
  return ctx;
};

export default RentalContext;
