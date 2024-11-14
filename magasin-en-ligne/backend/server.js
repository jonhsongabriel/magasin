const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');  // Importation de Multer
const app = express();
const port = 5000;

// Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Vous devez vous assurer que le dossier 'uploads' existe
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // Vous pouvez personnaliser le nom du fichier ici
  }
});

const upload = multer({ storage: storage });  // Middleware Multer

// Middleware
app.use(express.json());
app.use(cors()); // Permet les requêtes depuis le frontend React

// Connexion à MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Votre utilisateur MySQL
  password: '',  // Votre mot de passe MySQL
  database: 'magasin'  // Le nom de votre base de données
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connexion à la base de données réussie');
  }
});

// Route d'inscription avec gestion des fichiers (image)
app.post('/api/inscription', upload.single('image'), (req, res) => {
  // Logs pour vérifier les données reçues
  console.log('Corps de la requête:', req.body);
  console.log('Fichier téléchargé:', req.file);

  const { nom, prenom, adresse, contact, activite, domaine } = req.body;
  if (!nom || !prenom || !adresse || !contact || !activite || !domaine) {
    return res.status(400).send('Tous les champs doivent être remplis');
  }

  const image = req.file ? req.file.filename : null;

  const query = 'INSERT INTO utilisateurs (nom, prenom, adresse, contact, activite, domaine, image) VALUES (?, ?, ?, ?, ?, ?, ?)';

  db.query(query, [nom, prenom, adresse, contact, activite, domaine, image], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion:', err);
      return res.status(500).send('Erreur lors de l\'inscription');
    } else {
      console.log('Utilisateur ajouté:', result);
      res.status(200).send('Inscription réussie');
    }
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur backend en cours d'exécution sur http://localhost:${port}`);
});
