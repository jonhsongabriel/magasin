# Magasin en ligne

Un projet pour trouver des produits, matériels ou des biens pour la vie de tous les jours, pour faciliter la vie.

## Fonctionnalités

- Catalogue de marchandises par catégorie (Technologie, Alimentaire, Construction, Mode, Mécanique, Médicale)
- Catalogue par ville (Antananarivo, Fianarantsoa, Mahajanga, Tamatave, Toliara, Antsiranana)
- Importation / Exportation
- Recherche de produits
- Comptes membres (inscription, connexion)
- **Panier d'achat** (ajout, retrait, quantités — persistant dans le navigateur)
- **Commande (checkout)** avec tous les modes de paiement :
  - Carte bancaire (Visa / Mastercard)
  - Mobile Money (MVola, Orange Money, Airtel Money)
  - Virement bancaire
  - Espèces à la livraison
  - PayPal
- Espace partenaire (ajout de produits)

## Installation

```bash
cd magasin-en-ligne
npm install
# Backend (API + MySQL) :
node backend/server.js
# Frontend (dans un autre terminal) :
npm start
```

Le frontend tourne sur http://localhost:3000 et l'API sur http://localhost:5000.
