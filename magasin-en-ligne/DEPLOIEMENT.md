# DEPLOIEMENT GRATUIT SUR RENDER — Guide pas à pas

Le projet sera hébergé gratuitement sur [Render](https://render.com) :
- **Frontend** : site statique (gratuit, illimité)
- **Backend** : web service Node.js gratuit (750 h/mois, s'endort après 15 min d'inactivité, redémarre en ~1 min)
- **Base de données** : PostgreSQL gratuit (1 Go, expire après 30 jours → recrée-la ou passe sur [Neon](https://neon.tech) qui est gratuit sans expiration)

> ⚠️ La base PostgreSQL **gratuite de Render expire après 30 jours**. Alternative recommandée :
> [Neon](https://neon.tech) — PostgreSQL gratuit 0,5 Go **sans expiration**. Le backend est déjà
> compatible : il suffit de définir `DATABASE_URL` (voir plus bas).

---

## Étape 0 — Prérequis (déjà fait)
✅ Code poussé sur GitHub : https://github.com/jonhsongabriel/magasin
✅ Frontend : les URLs de l'API utilisent `process.env.REACT_APP_API_URL` (plus de localhost en dur)
✅ Backend : accepte `DATABASE_URL` (SSL auto) et écoute sur `0.0.0.0`

---

## Étape 1 — Créer la base de données PostgreSQL

**Option A — Neon (recommandé, gratuit sans expiration)**
1. Va sur https://neon.tech → inscription gratuite (GitHub)
2. Crée un projet "magasin"
3. Copie la **Connection String** (`postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`)

**Option B — Render (gratuit 30 jours)**
1. Dashboard Render → **New +** → **PostgreSQL** → plan Free
2. Copie l'**Internal Database URL**

Puis initialise le schéma (depuis ton PC) :
```
psql "TA_CONNECTION_STRING" -f backend/schema_postgres.sql
psql "TA_CONNECTION_STRING" -f backend/schema_commandes.sql
```

---

## Étape 2 — Déployer le backend (Web Service)

1. Dashboard Render → **New +** → **Web Service** → connecte ton repo GitHub `magasin`
2. Configuration :
   - **Root Directory** : `magasin-en-ligne/backend`
   - **Runtime** : Node
   - **Build Command** : `npm install`
   - **Start Command** : `node server.js`
   - **Plan** : Free
3. **Environment Variables** (section "Environment") :
   | Clé | Valeur |
   |---|---|
   | `DATABASE_URL` | ta connection string de l'étape 1 |
   | `JWT_SECRET` | un secret long et aléatoire |
   | `ADMIN_MOT_DE_PASSE` | ton mot de passe admin |
   | `SMTP_HOST` | `smtp.gmail.com` |
   | `SMTP_PORT` | `587` |
   | `SMTP_USER` | ton email Gmail |
   | `SMTP_PASS` | un **mot de passe d'application** Google (16 caractères) |

4. **Create Web Service** → Render déploie et te donne une URL comme
   `https://magasin-backend.onrender.com`

> ⚠️ **Important** : les images uploadées (`uploads/`) ne persistent PAS sur le plan gratuit
> (disque effacé à chaque redémarrage). Pour la prod réelle, utilise un stockage externe
> (Cloudinary gratuit par ex.). Pour tester, ça suffit.

---

## Étape 3 — Déployer le frontend (Static Site)

1. Dashboard Render → **New +** → **Static Site** → même repo GitHub
2. Configuration :
   - **Root Directory** : `magasin-en-ligne`
   - **Build Command** : `npm install && npm run build`
   - **Publish Directory** : `build`
3. **Environment Variables** :
   | Clé | Valeur |
   |---|---|
   | `REACT_APP_API_URL` | `https://magasin-backend.onrender.com` (l'URL de l'étape 2, SANS `/` final) |

4. **Create Static Site** → URL du site : `https://magasin-frontend.onrender.com`

---

## Étape 4 — Vérifier
- Ouvre `https://magasin-frontend.onrender.com` → la page d'accueil doit afficher les produits
- Le premier appel API peut prendre ~1 min (le backend gratuit "se réveille")

---

## Astuce : déployer via render.yaml (Blueprint)
Le fichier `render.yaml` à la racine du projet décrit tout automatiquement :
Dashboard → **New +** → **Blueprint** → sélectionne le repo → Render crée
backend + frontend + base d'après le fichier. Tu n'auras plus qu'à coller
les secrets (JWT, SMTP...) dans l'interface.

---

## Alternatives gratuites
| Plateforme | Quoi | Limite gratuite |
|---|---|---|
| **Render** | full-stack + PostgreSQL | 750 h/mois, DB expire 30 j |
| **Neon** | PostgreSQL | 0,5 Go, sans expiration ✅ |
| **Vercel / Netlify** | frontend statique | gratuit, très rapide |
| **Koyeb** | backend Node | 1 instance nano, sans endormissement |

En résumé, combo recommandé : **Neon (DB) + Render (backend) + Render ou Vercel (frontend)** = 0 €.
