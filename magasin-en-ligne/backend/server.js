// Importation des modules
const express = require('express');
const { Pool } = require('pg');           // PostgreSQL (serveur local)
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
require('dotenv').config();  // Charger les variables d'environnement

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());  // Permet les requêtes depuis le frontend React

// Servir les fichiers statiques du dossier 'uploads'
app.use('/uploads', express.static('uploads'));

/* ------------------------------------------------------------------ */
/* BASE DE DONNÉES : PostgreSQL local (base "magasin", indépendante)   */
/* ------------------------------------------------------------------ */
const db = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'magasin',
  max: 10,
});

// Test de connexion au démarrage
db.query('SELECT 1')
  .then(() => console.log('Connexion à PostgreSQL réussie (base: ' + (process.env.DB_NAME || 'magasin') + ')'))
  .catch((err) => console.error('Erreur de connexion à la base de données:', err.message));

// Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Assurez-vous que le dossier 'uploads' existe
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // Nom unique pour chaque fichier
  }
});

const upload = multer({ storage: storage });  // Middleware Multer

/* ------------------------------------------------------------------ */
/* EMAIL & FACTURE (nodemailer + PDF)                                 */
/* ------------------------------------------------------------------ */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Génère une facture PDF et renvoie le chemin du fichier
function genererFacturePDF(commande) {
  return new Promise((resolve, reject) => {
    const facturesDir = path.join(__dirname, 'factures');
    if (!fs.existsSync(facturesDir)) fs.mkdirSync(facturesDir);
    const filePath = path.join(facturesDir, `facture-${commande.numero}.pdf`);

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(22).text('Jonhson - Magasin en ligne', 50, 60);
    doc.fontSize(14).text(`FACTURE ${commande.numero}`, 50, 95);
    doc.fontSize(10).text(`Date : ${new Date().toLocaleString('fr-FR')}`, 50, 120);
    doc.fontSize(10).text(
      `Client : ${commande.client.nom || ''} — ${commande.client.email || ''}\n` +
      `Adresse : ${commande.client.adresse || ''} — Tél : ${commande.client.telephone || ''}`,
      50, 145,
    );
    doc.moveDown(1.5);

    commande.articles.forEach((a) => {
      doc.fontSize(11).text(
        `${a.nom}  x${a.quantite}  —  ${a.prix} Ar  =  ${(a.prix * a.quantite).toLocaleString('fr-FR')} Ar`,
      );
    });

    doc.moveDown(1);
    doc.fontSize(14).text(`TOTAL : ${Number(commande.total).toLocaleString('fr-FR')} Ar`);
    doc.fontSize(11).text(`Mode de paiement : ${commande.mode_paiement}`);
    doc.fontSize(9).text('Merci de votre confiance !');

    doc.end();
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

// Envoie la facture par email au client
async function envoyerFactureEmail(commande) {
  if (!commande.client.email) return;
  const pdfPath = await genererFacturePDF(commande);
  await transporter.sendMail({
    from: `"Jonhson Magasin" <${process.env.SMTP_USER || 'no-reply@jonhson.mg'}>`,
    to: commande.client.email,
    subject: `Votre facture ${commande.numero} - Jonhson`,
    html: `
      <h2>Merci pour votre commande !</h2>
      <p>Bonjour <b>${commande.client.nom}</b>,</p>
      <p>Votre commande <b>${commande.numero}</b> d'un montant de
      <b style="color:green">${Number(commande.total).toLocaleString('fr-FR')} Ar</b>
      a bien été enregistrée.</p>
      <p>Mode de paiement : <b>${commande.mode_paiement}</b></p>
      <p>Votre facture est jointe à cet email (PDF).</p>
      <p>À très bientôt chez Jonhson !</p>
    `,
    attachments: [
      { filename: `facture-${commande.numero}.pdf`, path: pdfPath },
    ],
  });
}

/* ------------------------------------------------------------------ */
/* MEMBRES                                                             */
/* ------------------------------------------------------------------ */

// Route d'inscription — mot de passe haché avec bcrypt
app.post('/api/inscription', upload.single('image'), async (req, res) => {
  const { nom, prenom, adresse, contact, activite, domaine, email, password } = req.body;
  const imagePath = req.file ? req.file.path : null;

  try {
    const passwordHache = bcrypt.hashSync(password, 10);
    await db.query(
      `INSERT INTO utilisateurs (nom, prenom, adresse, contact, activite, domaine, image, email, password)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [nom, prenom, adresse, contact, activite, domaine, imagePath, email, passwordHache],
    );
    console.log('Utilisateur ajouté avec succès');
    res.status(200).send('Inscription réussie');
  } catch (err) {
    console.error("Erreur d'insertion dans la base de données:", err.message);
    res.status(500).send("Erreur lors de l'inscription");
  }
});

// Route de login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM utilisateurs WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      console.log('Aucun utilisateur trouvé');
      return res.status(400).send({ message: 'Utilisateur non trouvé' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Mot de passe incorrect');
      return res.status(400).send({ message: 'Mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret-par-defaut',
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Connexion réussie', token });
  } catch (err) {
    console.error('Erreur de requête:', err.message);
    return res.status(500).send({ message: 'Erreur de serveur', error: err.message });
  }
});

app.get('/api/membres', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM utilisateurs ORDER BY id');

    const membresWithImages = result.rows.map((membre) => {
      if (membre.image) {
        membre.image = `http://localhost:5000/${membre.image.replace(/\\/g, '/')}`;
      }
      return membre;
    });

    res.status(200).json({ membres: membresWithImages });
  } catch (err) {
    console.error('Erreur lors de la récupération des membres:', err.message);
    return res.status(500).send({ message: 'Erreur de serveur', error: err.message });
  }
});

/* ------------------------------------------------------------------ */
/* PRODUITS                                                            */
/* ------------------------------------------------------------------ */

// Ajout d'un produit (admin)
app.post('/api/action', upload.single('produit_image'), async (req, res) => {
  const { produit_nom, produit_description, produit_prix, produit_type, produit_lieu } = req.body;
  const imagePath = req.file ? req.file.path : null;

  try {
    await db.query(
      `INSERT INTO produit (produit_nom, produit_description, produit_image, produit_prix, produit_type, produit_lieu)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [produit_nom, produit_description, imagePath, produit_prix, produit_type, produit_lieu],
    );
    console.log('Produit ajouté avec succès');
    res.status(200).send('Produit ajouté avec succès');
  } catch (err) {
    console.error("Erreur lors de l'ajout du produit :", err.message);
    res.status(500).send({ message: "Erreur lors de l'ajout du produit", error: err.message });
  }
});

// Fonction générique pour récupérer les produits (filtres + recherche)
const getProducts = (filter = {}) => {
  let query = 'SELECT * FROM produit';
  const conditions = [];
  const values = [];
  let n = 1;

  if (filter.lieu) {
    conditions.push(`produit_lieu = $${n++}`);
    values.push(filter.lieu);
  }

  if (filter.type) {
    conditions.push(`produit_type = $${n++}`);
    values.push(filter.type);
  }

  if (filter.search) {
    conditions.push(`(produit_nom ILIKE $${n++} OR produit_description ILIKE $${n++})`);
    values.push(`%${filter.search}%`, `%${filter.search}%`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  return { query, values };
};

// Endpoint pour récupérer les produits avec filtres
app.get('/api/produits', async (req, res) => {
  const { lieu, type, search } = req.query;
  const { query, values } = getProducts({ lieu, type, search });

  try {
    const result = await db.query(query, values);
    const produitsWithImages = result.rows.map((produit) => {
      if (produit.produit_image) {
        produit.produit_image = `http://localhost:5000/${produit.produit_image.replace(/\\/g, '/')}`;
      }
      return produit;
    });
    res.status(200).json({ produits: produitsWithImages });
  } catch (err) {
    console.error('Erreur lors de la récupération des produits:', err.message);
    return res.status(500).send({ message: 'Erreur de serveur', error: err.message });
  }
});

// Affichage de tous les produits (route historique)
app.get('/api/action', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM produit ORDER BY id DESC');
    const produitsWithImages = result.rows.map((produit) => {
      if (produit.produit_image) {
        produit.produit_image = `http://localhost:5000/${produit.produit_image.replace(/\\/g, '/')}`;
      }
      return produit;
    });
    res.status(200).json({ produit: produitsWithImages });
  } catch (err) {
    console.error('Erreur lors de la récupération des produits:', err.message);
    return res.status(500).send({ message: 'Erreur de serveur', error: err.message });
  }
});

/* ------------------------------------------------------------------ */
/* COMMANDES & PAIEMENTS                                              */
/* ------------------------------------------------------------------ */

// Création d'une commande (checkout, tous modes de paiement)
app.post('/api/commandes', async (req, res) => {
  const { client, articles, total, mode_paiement, paiement_details } = req.body || {};

  if (!client || !Array.isArray(articles) || articles.length === 0 || !mode_paiement) {
    return res.status(400).json({
      message: 'Commande invalide : client, articles et mode_paiement sont requis.',
    });
  }

  try {
    const result = await db.query(
      `INSERT INTO commandes
        (client_json, articles_json, total, mode_paiement, paiement_details_json, statut)
       VALUES ($1, $2, $3, $4, $5, 'en_attente')
       RETURNING id`,
      [
        JSON.stringify(client),
        JSON.stringify(articles),
        Number(total) || 0,
        mode_paiement,
        JSON.stringify(paiement_details || {}),
      ],
    );

    const commande = {
      id: result.rows[0].id,
      numero: `CMD-${result.rows[0].id}`,
      client,
      articles,
      total,
      mode_paiement,
      statut: 'en_attente',
    };

    // Envoi automatique de la facture par email (sans bloquer la réponse)
    envoyerFactureEmail(commande)
      .then(() => console.log(`Facture ${commande.numero} envoyée à ${client.email}`))
      .catch((errMail) =>
        console.error('Erreur envoi facture email:', errMail.message));

    res.status(201).json({
      message: 'Commande enregistrée avec succès. Facture envoyée par email.',
      commande,
    });
  } catch (err) {
    console.error('Erreur enregistrement commande:', err.message);
    return res.status(500).json({ message: 'Erreur serveur lors de la commande.' });
  }
});

// Liste des commandes (back-office)
app.get('/api/commandes', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM commandes ORDER BY id DESC');
    res.status(200).json({ commandes: result.rows });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Détail d'une commande
app.get('/api/commandes/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM commandes WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Commande introuvable.' });
    const row = result.rows[0];
    const clientJson = typeof row.client_json === 'string' ? JSON.parse(row.client_json) : row.client_json;
    const articlesJson = typeof row.articles_json === 'string' ? JSON.parse(row.articles_json) : row.articles_json;
    const paiementJson = typeof row.paiement_details_json === 'string'
      ? JSON.parse(row.paiement_details_json)
      : (row.paiement_details_json || {});

    res.status(200).json({
      commande: {
        id: row.id,
        numero: `CMD-${row.id}`,
        client: clientJson || {},
        articles: articlesJson || [],
        total: row.total,
        mode_paiement: row.mode_paiement,
        paiement_details: paiementJson,
        statut: row.statut,
        created_at: row.created_at,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur backend en cours d'exécution sur http://localhost:${port}`);
});
