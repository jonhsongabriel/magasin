const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');  // Importation de Multer
const bcrypt = require('bcrypt');  // Importation de bcrypt pour le hachage de mot de passe
const app = express();
const port = 5000;

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

app.post('/api/inscription', upload.single('image'), (req, res) => {
  const { nom, prenom, adresse, contact, activite, domaine, email, password } = req.body;
  const imagePath = req.file ? req.file.path : null;

  // Commencer la transaction
  db.beginTransaction((err) => {  // Remplacer 'connection' par 'db'
    if (err) {
      return res.status(500).send('Erreur lors de la transaction');
    }

    // Requête d'insertion
    const query = 'INSERT INTO utilisateurs (nom, prenom, adresse, contact, activite, domaine, image, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [nom, prenom, adresse, contact, activite, domaine, imagePath, email, password], (err, result) => {  // Remplacer 'connection' par 'db'
      if (err) {
        // En cas d'erreur, rollback la transaction
        return db.rollback(() => {  // Remplacer 'connection' par 'db'
          console.error('Erreur d\'insertion dans la base de données:', err);
          res.status(500).send('Erreur lors de l\'inscription');
        });
      }

      // Si tout est correct, valider la transaction
      db.commit((err) => {  // Remplacer 'connection' par 'db'
        if (err) {
          return db.rollback(() => {  // Remplacer 'connection' par 'db'
            console.error('Erreur de commit de la transaction:', err);
            res.status(500).send('Erreur lors de l\'inscription');
          });
        }

        console.log('Utilisateur ajouté avec succès');
        res.status(200).send('Inscription réussie');
      });
    });
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur backend en cours d'exécution sur http://localhost:${port}`);
});
