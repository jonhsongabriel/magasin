import React, { useContext, useState } from 'react';
import { SearchContext } from './SearchContext';

const SearchResultsPage = () => {
  const { searchResults, handleSearch } = useContext(SearchContext);
  const [query, setQuery] = useState('');

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    handleSearch(event.target.value); // Appeler la fonction de recherche
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Rechercher..."
      />
      <div>
        {searchResults.length > 0 ? (
          <ul>
            {searchResults.map((result, index) => (
              <li key={index}>{result.name}</li>
            ))}
          </ul>
        ) : (
          <p>Aucun résultat trouvé</p>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
