// Importation des modules
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();  // Charger les variables d'environnement

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());  // Permet les requêtes depuis le frontend React

// Servir les fichiers statiques du dossier 'uploads'
app.use('/uploads', express.static('uploads'));

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

// Route d'inscription
app.post('/api/inscription', upload.single('image'), (req, res) => {
  const { nom, prenom, adresse, contact, activite, domaine, email, password } = req.body;
  const imagePath = req.file ? req.file.path : null;

  // Commencer la transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).send('Erreur lors de la transaction');
    }

    // Requête d'insertion
    const query = 'INSERT INTO utilisateurs (nom, prenom, adresse, contact, activite, domaine, image, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [nom, prenom, adresse, contact, activite, domaine, imagePath, email, password], (err, result) => {
      if (err) {
        return db.rollback(() => {
          console.error('Erreur d\'insertion dans la base de données:', err);
          res.status(500).send('Erreur lors de l\'inscription');
        });
      }

      // Si tout est correct, valider la transaction
      db.commit((err) => {
        if (err) {
          return db.rollback(() => {
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




// Route de login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  console.log("Email fourni :", email);
  console.log("Mot de passe fourni :", password);

  const query = 'SELECT * FROM utilisateurs WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err) {
      console.error('Erreur de requête:', err);
      return res.status(500).send({ message: 'Erreur de serveur', error: err });
    }

    if (result.length === 0) {
      console.log('Aucun utilisateur trouvé');
      return res.status(400).send({ message: 'Utilisateur non trouvé' });
    }

    const user = result[0];
    console.log("Utilisateur trouvé :", user);

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Erreur de comparaison de mot de passe:', err);
        return res.status(500).send({ message: 'Erreur de serveur', error: err });
      }

      if (!isMatch) {
        console.log('Mot de passe incorrect');
        return res.status(400).send({ message: 'Mot de passe incorrect' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({ message: 'Connexion réussie', token });
    });
  });
});

app.get('/api/membres', (req, res) => {
  const query = 'SELECT * FROM utilisateurs';

  db.query(query, (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération des membres:', err);
      return res.status(500).send({ message: 'Erreur de serveur', error: err });
    }

    const membresWithImages = result.map((membre) => {
      if (membre.image) {
        // Corrigez les backslashes en slashes
        const correctedPath = membre.image.replace(/\\/g, '/');
        membre.image = `http://localhost:5000/${correctedPath}`;
      } else {
        console.log(`Aucune image pour le membre ID: ${membre.id}`);
      }
      console.log('Image finale pour ce membre:', membre.image);
      return membre;
    });

    res.status(200).json({ membres: membresWithImages });
  });
});


app.post('/api/Action', upload.single('produit_image'), (req, res) => {
  const { produit_nom, produit_description,produit_prix,produit_type,produit_lieu } = req.body;
  const imagePath = req.file ? req.file.path : null;

  db.beginTransaction((err) => {
    if (err) {
      console.error('Erreur lors de la transaction :', err);
      return res.status(500).send('Erreur lors de la transaction');
    }

    const query = `
      INSERT INTO produit (produit_nom, produit_description, produit_image,produit_prix,produit_type,produit_lieu)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [produit_nom, produit_description, imagePath, produit_prix, produit_type,produit_lieu], 
        (err, result) => 
        {
         if (err) {
        console.error('Erreur lors de l\'ajout du produit :', err);
        return db.rollback(() => {
          res.status(500).send({ message: 'Erreur lors de l’ajout du produit', error: err });
        });
      }

      db.commit((err) => {
        if (err) {
          console.error('Erreur lors de la validation de la transaction :', err);
          return db.rollback(() => {
            res.status(500).send('Erreur lors de la validation de la transaction');
          });
        }

        console.log('Produit ajouté avec succès :', result);
        res.status(200).send('Produit ajouté avec succès');
      });
    });
  });
});




//Affichage des produit

app.get('/api/action', (req, res) => {
  const query = 'SELECT * FROM produit';

  db.query(query, (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération des produit:', err);
      return res.status(500).send({ message: 'Erreur de serveur', error: err });
    }

    const membresWithImages = result.map((produit) => {
      if (produit.produit_image) {
        // Corrigez les backslashes en slashes
        const correctedPath = membre.image.replace(/\\/g, '/');
        membre.produit_image = `http://localhost:5000/${correctedPath}`;
      } else {
        console.log(`Aucune image pour le membre ID: ${produit.id}`);
      }
      console.log('Image finale pour ce membre:', produit.produit_image);
      return produit;
    });

    res.status(200).json({ produit: membresWithImages });
  });
});




//Affichage des produit 
// Fonction générique pour récupérer les produits
const getProducts = (filter = {}) => {
  let query = 'SELECT * FROM produit';
  const conditions = [];
  const values = [];

  if (filter.lieu) {
    conditions.push('produit_lieu = ?');
    values.push(filter.lieu);
  }

  if (filter.type) {
    conditions.push('produit_type = ?');
    values.push(filter.type);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  return { query, values };
};

// Endpoint pour récupérer les produits avec filtres
app.get('/api/produits', (req, res) => {
  const { lieu, type } = req.query;
  const { query, values } = getProducts({ lieu, type });

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération des produits:', err);
      return res.status(500).send({ message: 'Erreur de serveur', error: err });
    }

    const produitsWithImages = result.map((produit) => {
      if (produit.produit_image) {
        const correctedPath = produit.produit_image.replace(/\\/g, '/');
        produit.produit_image = `http://localhost:5000/${correctedPath}`;
      }
      return produit;
    });

    res.status(200).json({ produits: produitsWithImages });
  });
});


// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur backend en cours d'exécution sur http://localhost:${port}`);
});
