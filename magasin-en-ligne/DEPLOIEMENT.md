# DÉPLOIEMENT GRATUIT — Neon (base de données) + Render (site)

Combo recommandé, 100 % gratuit et durable :

| Composant | Plateforme | Pourquoi |
|---|---|---|
| **Base de données PostgreSQL** | [Neon](https://neon.tech) | Gratuit 0,5 Go, **sans expiration**, sans carte bancaire |
| **Backend (API Node.js)** | [Render](https://render.com) | Web service gratuit 750 h/mois (s'endort après 15 min d'inactivité, se réveille en ~1 min) |
| **Frontend (React build)** | [Render](https://render.com) | Site statique gratuit, illimité |

> ⚠️ On évite la base PostgreSQL gratuite de Render : elle **expire après 30 jours**.
> Neon n'a pas cette limite.

---

## Étape 0 — Prérequis (déjà fait ✅)
- ✅ Code poussé sur GitHub : https://github.com/jonhsongabriel/magasin
- ✅ Frontend : les URLs de l'API utilisent `process.env.REACT_APP_API_URL` (plus de localhost en dur)
- ✅ Backend : accepte `DATABASE_URL` avec SSL automatique (requis par Neon) et écoute sur `0.0.0.0`

---

## Étape 1 — Créer la base de données sur Neon

1. Va sur **https://neon.tech** → **Sign Up** → connecte-toi avec GitHub (gratuit, pas de carte)
2. **Create project** → nom : `magasin` → région la plus proche (ex. `Europe - Frankfurt`)
3. Neon te montre la **Connection String**, de la forme :
   ```
   postgresql://neondb_owner:XXXX@ep-xxxxx-p123456.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
   → **Copie-la et garde-la précieusement** (c'est ton `DATABASE_URL`)

### 1bis — Charger le schéma dans Neon

Depuis ton PC (PowerShell), avec `psql` installé (inclus avec PostgreSQL local) :

```powershell
psql "TA_CONNECTION_STRING_NEON" -f "D:\Lumen androide\magasin\magasin-en-ligne\backend\schema_postgres.sql"
psql "TA_CONNECTION_STRING_NEON" -f "D:\Lumen androide\magasin\magasin-en-ligne\backend\schema_commandes.sql"
```

> Si tu n'as pas `psql`, alternative : dans la console Neon, onglet **SQL Editor**,
> colle le contenu de chaque fichier `.sql` et exécute.

Vérifie : dans Neon → **Tables**, tu dois voir tes tables (`produits`, `commandes`, etc.).

---

## Étape 2 — Déployer le backend sur Render (Web Service)

1. Va sur **https://dashboard.render.com** → inscription avec GitHub
2. **New +** → **Web Service** → **Build and deploy from a Git repository** → connecte le repo `magasin`
3. Configuration :
   - **Root Directory** : `magasin-en-ligne/backend`
   - **Runtime** : Node
   - **Build Command** : `npm install`
   - **Start Command** : `node server.js`
   - **Instance Type** : Free
4. Section **Environment Variables** → **Add** pour chacune :

   | Clé | Valeur |
   |---|---|
   | `DATABASE_URL` | ta connection string Neon de l'étape 1 |
   | `JWT_SECRET` | un secret long et aléatoire (ex. 40 caractères) |
   | `ADMIN_MOT_DE_PASSE` | ton mot de passe admin |
   | `SMTP_HOST` | `smtp.gmail.com` |
   | `SMTP_PORT` | `587` |
   | `SMTP_USER` | ton email Gmail |
   | `SMTP_PASS` | un **mot de passe d'application** Google (16 caractères, [crée-le ici](https://myaccount.google.com/apppasswords)) |

5. **Create Web Service** → le déploiement démarre (quelques minutes)
6. En haut de la page, Render affiche l'URL du backend, ex. :
   ```
   https://magasin-backend-xxxx.onrender.com
   ```
   → **Note-la**, c'est ton `REACT_APP_API_URL` pour l'étape 3.

**Test rapide** : ouvre `https://TON-BACKEND.onrender.com/api/produits` → tu dois voir du JSON
(le premier appel peut mettre ~1 minute, le service gratuit se réveille).

---

## Étape 3 — Déployer le frontend sur Render (Static Site)

1. Dashboard Render → **New +** → **Static Site** → même repo `magasin`
2. Configuration :
   - **Root Directory** : `magasin-en-ligne`
   - **Build Command** : `npm install && npm run build`
   - **Publish Directory** : `build`
3. **Environment Variables** :

   | Clé | Valeur |
   |---|---|
   | `REACT_APP_API_URL` | `https://TON-BACKEND.onrender.com` (l'URL de l'étape 2, **SANS `/` final**) |

4. **Create Static Site** → ton site est en ligne, ex. `https://magasin-xxxx.onrender.com`

> ⚠️ La variable `REACT_APP_API_URL` est lue **au moment du build**. Si tu changes
> l'URL du backend plus tard, il faut faire **Manual Deploy → Clear build cache & deploy**
> sur le site statique.

---

## Étape 4 — Vérifier

- Ouvre l'URL du frontend → la page d'accueil doit afficher les produits de Neon
- Teste : recherche, connexion membre, panier
- Backend endormi ? Le premier clic met ~1 min, ensuite c'est fluide
- Pour éviter l'endormissement pendant tes tests : outil gratuit comme
  [UptimeRobot](https://uptimerobot.com) qui "ping" l'URL du backend toutes les 5 min

---

## Limites à connaître (plan gratuit)

| Limite | Impact | Solution |
|---|---|---|
| Backend Render s'endort après 15 min sans visite | 1re requête lente (~1 min) | UptimeRobot, ou payer $7/mois |
| Images uploadées (`uploads/`) effacées au redémarrage | Les produits ajoutés via l'admin perdent leur image | Stockage externe gratuit : [Cloudinary](https://cloudinary.com) |
| Neon 0,5 Go de stockage | Largement suffisant pour un catalogue | — |
| Neon suspend le projet après ~5 jours d'inactivité | Se réactive depuis la console Neon | Une visite par semaine suffit |

---

## Alternatives gratuites
| Plateforme | Quoi | Limite gratuite |
|---|---|---|
| **Neon** ✅ | PostgreSQL | 0,5 Go, sans expiration |
| **Render** ✅ | backend + frontend | 750 h/mois backend |
| **Vercel / Netlify** | frontend statique | gratuit, très rapide (alternative à Render pour le front) |
| **Koyeb** | backend Node | 1 instance nano, sans endormissement |

**Coût total : 0 €.**
