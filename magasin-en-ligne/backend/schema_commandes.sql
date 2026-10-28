-- Base de données du magasin en ligne
-- Table des commandes (checkout avec tous les modes de paiement)

CREATE DATABASE IF NOT EXISTS magasin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE magasin;

CREATE TABLE IF NOT EXISTS commandes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_json JSON NOT NULL,
  articles_json JSON NOT NULL,
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  mode_paiement VARCHAR(50) NOT NULL,
  paiement_details_json JSON NULL,
  statut VARCHAR(30) NOT NULL DEFAULT 'en_attente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Statuts possibles : en_attente, payee, expediee, livree, annulee
