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
/* ADMIN — authentification (mot de passe dans .env)                   */
/* ------------------------------------------------------------------ */
const ADMIN_MOT_DE_PASSE = process.env.ADMIN_MOT_DE_PASSE || 'admin123';

// Vérifie le token JWT admin (middleware)
function verifierAdmin(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: 'Accès admin refusé : connexion requise.' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret-par-defaut');
    if (payload.role !== 'admin') {
      return res.status(403).json({ message: 'Accès réservé à l\'administrateur.' });
    }
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Session admin expirée, reconnectez-vous.' });
  }
}

// Connexion admin
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (!password || password !== ADMIN_MOT_DE_PASSE) {
    return res.status(401).json({ message: 'Mot de passe admin incorrect.' });
  }
  const token = jwt.sign(
    { role: 'admin' },
    process.env.JWT_SECRET || 'secret-par-defaut',
    { expiresIn: '8h' }
  );
  res.status(200).json({ message: 'Connexion admin réussie', token });
});

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
    doc.fontSize(11).text(
      `Mode de livraison : ${commande.mode_livraison || 'a_prendre'}` +
      (commande.frais_livraison ? ` (frais : ${commande.frais_livraison} Ar)` : ' (gratuit)'),
    );
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
      <p>Mode de livraison : <b>${commande.mode_livraison || 'a_prendre'}</b>
      ${commande.frais_livraison ? `— frais : ${commande.frais_livraison} Ar` : '— gratuit'}</p>
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

// Ajout d'un produit (admin uniquement)
app.post('/api/action', verifierAdmin, upload.single('produit_image'), async (req, res) => {
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

// Suppression d'un produit (admin uniquement)
app.delete('/api/action/:id', verifierAdmin, async (req, res) => {
  try {
    const result = await db.query('DELETE FROM produit WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produit introuvable.' });
    }
    res.status(200).json({ message: 'Produit supprimé.' });
  } catch (err) {
    console.error('Erreur suppression produit:', err.message);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Modifier le statut d'une commande (admin uniquement)
app.patch('/api/commandes/:id/statut', verifierAdmin, async (req, res) => {
  const { statut } = req.body || {};
  const statutsValides = ['en_attente', 'payee', 'expediee', 'livree', 'annulee'];
  if (!statutsValides.includes(statut)) {
    return res.status(400).json({ message: 'Statut invalide.', statuts: statutsValides });
  }
  try {
    const result = await db.query(
      'UPDATE commandes SET statut = $1 WHERE id = $2 RETURNING id, statut',
      [statut, req.params.id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Commande introuvable.' });
    }
    res.status(200).json({ message: 'Statut mis à jour.', commande: result.rows[0] });
  } catch (err) {
    console.error('Erreur maj statut:', err.message);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});
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

// Création d'une commande (checkout, tous modes de paiement et de livraison)
const MODES_LIVRAISON = [
  'a_prendre', 'livreur_moto', 'bicyclette', 'personne',
  'automobile', 'navire', 'avion', 'colis_express', 'autres',
];

const FRAIS_LIVRAISON = {
  a_prendre: 0,
  livreur_moto: 5000,
  bicyclette: 3000,
  personne: 4000,
  automobile: 10000,
  navire: 50000,
  avion: 80000,
  colis_express: 25000,
  autres: 15000,
};

app.post('/api/commandes', async (req, res) => {
  const { client, articles, total, mode_paiement, paiement_details, mode_livraison, livraison_details } = req.body || {};

  if (!client || !Array.isArray(articles) || articles.length === 0 || !mode_paiement) {
    return res.status(400).json({
      message: 'Commande invalide : client, articles et mode_paiement sont requis.',
    });
  }

  try {
    // Validation du mode de livraison et calcul des frais
    const livraison = mode_livraison && MODES_LIVRAISON.includes(mode_livraison)
      ? mode_livraison
      : 'a_prendre';
    const frais = FRAIS_LIVRAISON[livraison] || 0;
    const totalFinal = (Number(total) || 0) + frais;

    const result = await db.query(
      `INSERT INTO commandes
        (client_json, articles_json, total, mode_paiement, paiement_details_json, mode_livraison, livraison_details_json, frais_livraison, statut)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'en_attente')
       RETURNING id`,
      [
        JSON.stringify(client),
        JSON.stringify(articles),
        totalFinal,
        mode_paiement,
        JSON.stringify(paiement_details || {}),
        livraison,
        JSON.stringify(livraison_details || {}),
        frais,
      ],
    );

    const commande = {
      id: result.rows[0].id,
      numero: `CMD-${result.rows[0].id}`,
      client,
      articles,
      total: totalFinal,
      total_articles: Number(total) || 0,
      mode_paiement,
      mode_livraison: livraison,
      frais_livraison: frais,
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
