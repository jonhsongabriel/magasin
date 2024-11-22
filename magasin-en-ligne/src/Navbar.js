import { useNavigate } from 'react-router-dom';

const onSubmit = (e) => {
  e.preventDefault();
  handleSearch(localSearch);
  navigate('/results'); // Redirige vers la page des résultats
};
