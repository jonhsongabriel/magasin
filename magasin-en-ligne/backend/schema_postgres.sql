-- ============================================================
--  Magasin en ligne — schéma pour POSTGRESQL
--  À exécuter sur le serveur local (localhost:5432)
--  psql -U postgres -d magasin -f schema_postgres.sql
-- ============================================================

-- La base est créée séparément :
--   CREATE DATABASE magasin;

-- ------------------------------------------------------------
-- TABLE produit
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS produit (
  id                  SERIAL PRIMARY KEY,
  produit_nom         VARCHAR(255) NOT NULL,
  produit_description TEXT,
  produit_image       VARCHAR(500),
  produit_prix        NUMERIC(12,2) NOT NULL DEFAULT 0,
  produit_type        VARCHAR(100),
  produit_lieu        VARCHAR(100),
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_produit_nom  ON produit(produit_nom);
CREATE INDEX IF NOT EXISTS idx_produit_type ON produit(produit_type);
CREATE INDEX IF NOT EXISTS idx_produit_lieu ON produit(produit_lieu);

-- ------------------------------------------------------------
-- TABLE utilisateurs
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS utilisateurs (
  id        SERIAL PRIMARY KEY,
  nom       VARCHAR(100) NOT NULL,
  prenom    VARCHAR(100),
  adresse   VARCHAR(255),
  contact   VARCHAR(50),
  activite  VARCHAR(100),
  domaine   VARCHAR(100),
  image     VARCHAR(500),
  email     VARCHAR(255) NOT NULL UNIQUE,
  password  VARCHAR(255) NOT NULL,
  role      VARCHAR(20) NOT NULL DEFAULT 'membre',  -- 'admin' ou 'membre'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- TABLE commandes
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS commandes (
  id                    SERIAL PRIMARY KEY,
  client_json           JSONB NOT NULL,
  articles_json         JSONB NOT NULL,
  total                 NUMERIC(12,2) NOT NULL DEFAULT 0,
  mode_paiement         VARCHAR(50) NOT NULL,
  paiement_details_json JSONB,
  statut                VARCHAR(30) NOT NULL DEFAULT 'en_attente',
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Statuts possibles : en_attente, payee, expediee, livree, annulee

-- --------------------------------------------------------------
-- ADMIN — mot de passe hashé (changez ADMIN_MOT_DE_PASSE dans .env)
-- L'admin n'a pas besoin de table : le mot de passe vient du .env
-- et le backend signe un JWT role=admin.

-- ------------------------------------------------------------
-- LIVRAISON : ajout des colonnes dans commandes
-- ------------------------------------------------------------
ALTER TABLE commandes ADD COLUMN IF NOT EXISTS mode_livraison VARCHAR(50);
ALTER TABLE commandes ADD COLUMN IF NOT EXISTS livraison_details_json JSONB;
ALTER TABLE commandes ADD COLUMN IF NOT EXISTS frais_livraison NUMERIC(10,2) NOT NULL DEFAULT 0;

-- Modes de livraison possibles :
-- a_prendre, livreur_moto, bicyclette, personne, automobile, navire,
-- avion, colis_express, autres

-- ------------------------------------------------------------
-- TABLE livreurs (coursiers gérés par l'admin)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS livreurs (
  id            SERIAL PRIMARY KEY,
  nom           VARCHAR(100) NOT NULL,
  prenom        VARCHAR(100),
  telephone     VARCHAR(50) NOT NULL,
  email         VARCHAR(255),
  type_vehicule VARCHAR(50) NOT NULL,  -- moto, bicyclette, personne, automobile, navire, avion, colis_express, autres
  ville         VARCHAR(100),
  disponible    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- TRAVAIL : offres d'emploi (publiées par l'admin uniquement)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS offres_emploi (
  id            SERIAL PRIMARY KEY,
  titre         VARCHAR(255) NOT NULL,
  entreprise    VARCHAR(255),
  categorie     VARCHAR(100),          -- ex: BTP, Santé, Tech, Commerce...
  ville         VARCHAR(100),
  type_contrat  VARCHAR(50),           -- CDI, CDD, Stage, Freelance, Journalier
  salaire       VARCHAR(100),
  description   TEXT,
  contact       VARCHAR(255),          -- email / téléphone de candidature
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_offres_ville ON offres_emploi(ville);
CREATE INDEX IF NOT EXISTS idx_offres_categorie ON offres_emploi(categorie);

-- ------------------------------------------------------------
-- TRAVAIL : candidats (personnes qui cherchent un emploi,
-- profil + CV déposé par l'admin pour la personne)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS candidats (
  id            SERIAL PRIMARY KEY,
  nom           VARCHAR(150) NOT NULL,
  prenom        VARCHAR(150),
  email         VARCHAR(255),
  telephone     VARCHAR(50),
  ville         VARCHAR(100),
  domaine       VARCHAR(100),          -- domaine de compétence
  competences   TEXT,
  experience    TEXT,
  formation     TEXT,
  langues       VARCHAR(255),
  cv_nom        VARCHAR(255),          -- nom du fichier CV uploadé
  disponibilite VARCHAR(50),           -- immédiate, 1 mois, etc.
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
