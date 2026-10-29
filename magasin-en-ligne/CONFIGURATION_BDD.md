# Configuration de la base de données PostgreSQL

## 1. Créer la base "magasin"

**Option A — pgAdmin** (recommandé, interface graphique) :
1. Ouvrir pgAdmin
2. Clic droit sur **Databases** → **Create** → **Database…**
3. Nom : `magasin` → Save

**Option B — psql** (ligne de commande) :
```sql
CREATE DATABASE magasin;
```

## 2. Créer les tables

Ouvrir **Query Tool** dans pgAdmin sur la base `magasin`, puis exécuter le contenu de `backend/schema_postgres.sql`
(ou via psql : `psql -U postgres -d magasin -f schema_postgres.sql`).

## 3. Configurer le mot de passe dans le backend

Éditer `backend/.env` :
```
DB_USER=postgres
DB_PASSWORD=<votre mot de passe PostgreSQL>
DB_NAME=magasin
```
Puis redémarrer le serveur.

## 4. Vérification

`node server.js` doit afficher : « Connexion à PostgreSQL réussie (base: magasin) ».

## 5. Les logos

Les logos jonhson sont déjà intégrés dans `src/assets/` :
- `gj-logo.png` — logo principal Jonhson
- `gj-menu-icon.png` — icône du menu
- `jonhson-logo.jpg` — logo Jonhson (haute résolution)

Pour les utiliser dans un composant React :
```jsx
import logoJonhson from './assets/gj-logo.png';

<img src={logoJonhson} alt="Jonhson Magasin" />
```
