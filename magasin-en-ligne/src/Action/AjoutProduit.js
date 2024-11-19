import React, { useState } from 'react';

function AjoutProduit() {
  const [formData, setFormData] = useState({
    produit_nom: '',
    produit_description: '',
    produit_image: null,
    produit_prix:'',
    produit_type:'',
    produit_lieu:''
  });

  // Mise à jour des champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Création de l'objet FormData
    const ajoutProduit = new FormData();
    ajoutProduit.append('produit_nom', formData.produit_nom);
    ajoutProduit.append('produit_description', formData.produit_description);
    ajoutProduit.append('produit_image', formData.produit_image);
    ajoutProduit.append('produit_prix', formData.produit_prix);
    ajoutProduit.append('produit_type', formData.produit_type);
    ajoutProduit.append('produit_lieu', formData.produit_lieu);

    console.log('Données envoyées :', Object.fromEntries(ajoutProduit.entries()));

    try {
      const response = await fetch('http://localhost:5000/api/action', {
        method: 'POST',
        body: ajoutProduit,
      });

      if (response.ok) {
        alert('Produit ajouté avec succès');
        setFormData({
           produit_nom: '',
           produit_description: '', 
           produit_image: null,
           produit_prix:'',
           produit_type:'',
           produit_lieu:'', 
          }); // Réinitialisation
      } else {
        alert('Erreur lors de l’ajout du produit');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de l’ajout du produit');
    }
  };

  return (
    <div className="container p-4 bg-secondary mt-2 mb-2">
      <h2 className="text-center text-white">Ajout Produit</h2>
      <form onSubmit={handleSubmit}>
        {/* Nom du produit */}
        <div className="mb-3 mt-3">
          <label htmlFor="produit_nom" className="form-label text-white">
            Nom du produit:
          </label>
          <input
            type="text"
            className="form-control"
            name="produit_nom"
            placeholder="Nom du produit"
            value={formData.produit_nom}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description du produit */}
        <div className="mb-3 mt-3">
          <label htmlFor="produit_description" className="form-label text-white">
            Description du produit:
          </label>
          <input
            type="text"
            className="form-control"
            name="produit_description"
            placeholder="Description du produit"
            value={formData.produit_description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Image du produit */}
        <div className="mb-3 mt-3">
          <label htmlFor="produit_image" className="form-label text-white">
            Image du produit:
          </label>
          <input
            type="file"
            className="form-control"
            name="produit_image"
            onChange={(e) =>
              setFormData({ ...formData, produit_image: e.target.files[0] })
            }
          />
        </div>

         {/* Prix du produit */}
         <div className="mb-3 mt-3">
          <label htmlFor="produit_prix" className="form-label text-white">
            Prix du produit:
          </label>
          <input
            type="number"
            className="form-control"
            name="produit_prix"
            placeholder="Prix en Ariary "
            value={formData.produit_prix}
            onChange={handleChange}
            required
          />
        </div>


         {/* Nom du produit */}
         <div className="mb-3 mt-3">
          <label htmlFor="produit_type" className="form-label text-white">
            Type du produit:
          </label>
          <select
            type="text"
            className="form-control"
            name="produit_type"
            placeholder="Type du produit"
            value={formData.produit_type}
            onChange={handleChange}
            required
          >
          <option value="">--Selectionner le type de produit --</option>
          <option value="Aliment">Alimentaire</option>
          <option value="Construction">Construction</option>
          <option value="Exportation">Exportation</option>
          <option value="Importation">Importation</option>
          <option value="Mecanique">Mecanique</option>
          <option value="Medicale">Medicale</option>
          <option value="Mode">Mode</option>
          <option value="Tech">Tech</option>
          </select>
          
        </div>

         {/* Nom du produit */}
         <div className="mb-3 mt-3">
          <label htmlFor="produit_lieu" className="form-label text-white">
            Adresse fournisseur:
          </label>
          <select
            className="form-control"
            name="produit_lieu"
            value={formData.produit_lieu}
            onChange={handleChange}
            required
          >
            <option value="">-- Sélectionnez une ville --</option>
            <option value="Antananarivo">Antananarivo</option>
            <option value="Mahajanga">Mahajanga</option>
            <option value="Fianarantsoa">Fianarantsoa</option>
            <option value="Toliara">Toliara</option>
            <option value="Antsiranana">Antsiranana</option>
            <option value="Tamatave">Tamatave</option>
          </select>
        </div>


        {/* Bouton de soumission */}
        <div className="text-center">
          <button type="submit" className="btn btn-success p-2">
            Ajouter le produit
          </button>
        </div>
      </form>
    </div>
  );
}

export default AjoutProduit;
