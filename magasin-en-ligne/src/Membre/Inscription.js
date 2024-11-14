import React, { useState } from 'react';

function Inscription() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    adresse: '',
    contact: '',
    activite: '',
    domaine: '',
    image: null,
    email:'',
    password:''
  });

  // Mise à jour des champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

// Gestion de la soumission du formulaire
const handleSubmit = async (e) => {
  e.preventDefault();

  const formDataToSend = new FormData();
  formDataToSend.append('nom', formData.nom);
  formDataToSend.append('prenom', formData.prenom);
  formDataToSend.append('adresse', formData.adresse);
  formDataToSend.append('contact', formData.contact);
  formDataToSend.append('activite', formData.activite);
  formDataToSend.append('domaine', formData.domaine);
  formDataToSend.append('image', formData.image);
  formDataToSend.append('email', formData.email);
  formDataToSend.append('password', formData.password);

  console.log("Données envoyées : ", Object.fromEntries(formDataToSend.entries())); // Ajout du log pour vérifier

  try {
    const response = await fetch('http://localhost:5000/api/inscription', {
      method: 'POST',
      body: formDataToSend
    });

    if (response.ok) {
      alert("Inscription réussie");
    } else {
      alert("L'inscription n'a pas été effectuée");
    }
  } catch (error) {
    console.error("Erreur:", error);
    alert("Une erreur est survenue lors de l'inscription");
  }
};


  return (
    <div className='container  p-4 bg-secondary mt-2 mb-2 '>
      <h2 className='text-center text-white '>Inscription</h2>
      <form onSubmit={handleSubmit}>

          <div className="mb-3 mt-3">
              <label for="nom" className="form-label text-white">Nom:</label>
              <input type="text" className='form-control' name="nom" placeholder="Nom" onChange={handleChange} required />
           </div>
           <div className="mb-3 mt-3">
              <label for="prenom" className="form-label text-white">Prenom:</label>
              <input type="text" className='form-control' name="prenom" placeholder="Prénom" onChange={handleChange} required />
           </div>
      
           <div className="mb-3 mt-3">
              <label for="adresse" className="form-label text-white">Adresse:</label>
              <input type="text" className='form-control' name="adresse" placeholder="Adresse" onChange={handleChange} required />
           </div>

           <div className="mb-3 mt-3">
              <label for="contact" className="form-label text-white">Contact:</label>
              <input type="text" className='form-control' name="contact" placeholder="Contact" onChange={handleChange} required />
           </div>

           <div className="mb-3 mt-3">
              <label for="activite" className="form-label text-white">Activité:</label>
              <input type="text" className='form-control' name="activite" placeholder="Activité" onChange={handleChange} required />
           </div>

           <div className="mb-3 mt-3">
              <label for="domaine" className="form-label text-white">Domaine:</label>
              <input type="text" className='form-control' name="domaine" placeholder="Domaine" onChange={handleChange} required />
           </div>
        
           <div className="mb-3 mt-3">
              <label for="image" className="form-label text-white">Image:</label>
              <input type="file" className='form-control' name="image" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />
           </div>
           <div className="mb-3 mt-3">
              <label for="email" className="form-label text-white">Email:</label>
              <input type="text" className='form-control' name="email" placeholder="Email" onChange={handleChange} required />
           </div>
           <div className="mb-3 mt-3">
              <label for="password" className="form-label text-white">Password:</label>
              <input type="password" className='form-control' name="password" placeholder="Password" onChange={handleChange} required />
           </div>
        
        <div className='text-center'>
            <button type="submit" className='btn btn-success p-2'>S'inscrire maintenant</button>
        </div>
             
      </form>
    </div>
  );
}

export default Inscription;
