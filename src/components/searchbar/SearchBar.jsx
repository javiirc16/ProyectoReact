import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits, Configure, Highlight } from 'react-instantsearch';
import { useState } from 'react';
import './SearchBar.css';

const searchClient = algoliasearch('EXYWXN8Y7A', '4481db0aa15fdc39121ed49297f69e2a');

const Hit = ({ hit }) => (
  <div className="hit-item">
      <img className="imagen" src={hit.image} alt={hit.title} />
      <p className="primary-text">
        <Highlight attribute="title" hit={hit} />
      </p>
      <p className="secondary-text">
        <Highlight attribute="price" hit={hit} />
      </p>
  </div>
);

export const SearchBar = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleStateChange = ({ uiState }) => {
    if (uiState.products.query) {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  };

  return (
    <InstantSearch searchClient={searchClient} indexName="products" onStateChange={handleStateChange}>
      <div className="search-container">
        <SearchBox translations={{ placeholder: 'Buscar' }} />
        {showPopup && (
          <div className="search-popup">
            <Hits hitComponent={Hit} />
          </div>
        )}
        <Configure hitsPerPage={3} />
      </div>
    </InstantSearch>
  );
};