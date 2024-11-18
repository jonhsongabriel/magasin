import React, { useState, useEffect } from 'react';

function ListeMembres() {
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupérer les membres depuis l'API
  useEffect(() => {
    const fetchMembres = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/membres');
        if (response.ok) {
          const data = await response.json();
          setMembres(data.membres); // Accès aux membres dans la réponse
        } else {
          console.error('Erreur lors de la récupération des membres');
        }
      } catch (error) {
        console.error('Erreur de connexion:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembres();
  }, []);

  if (loading) {
    return <div className="text-center">Chargement des membres...</div>;
  }

  return (
    <div className="container p-4 bg-secondary mt-2 mb-2">
      <h2 className="text-center text-white">Liste des Membres</h2>
      <div className="row">
        {membres.map((membre) => (
          <div className="col-md-4 mb-4 " key={membre._id}>
            <div className="card bg-white">
              <img
                src={membre.image || 'https://via.placeholder.com/150'}
                alt={membre.nom}
                className="card-img-top"
                style={{ height: '16em' }}
              />
              <div className="card-body">
                <h5 className="card-title text-center text-success">{membre.nom} </h5>
                <h6 className="card-title text-center text-success"> {membre.prenom}</h6>
                <p className="card-text">
                  <strong>Adresse:</strong> {membre.adresse}
                </p>
                <p className="card-text">
                  <strong>Contact:</strong> {membre.contact}
                </p>
                <p className="card-text">
                  <strong>Activité:</strong> {membre.activite}
                </p>
                <p className="card-text">
                  <strong>Domaine:</strong> {membre.domaine}
                </p>
                <p className="card-text">
                  <strong>Email:</strong> {membre.email}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListeMembres;
