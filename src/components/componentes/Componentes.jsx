import React, { useState } from 'react';
import './Componentes.css';

const Componente = ({ className, title }) => (
  <div className={`card ${className}`}>
    <div className="card-content">
      <h3>{title}</h3>
    </div>
  </div>
);

export const Componentes = () => {
  const [showA, setShowA] = useState(true);
  const [showB, setShowB] = useState(true);
  const [showC, setShowC] = useState(true);

  const toggleAll = () => {
    const newState = !(showA && showB && showC);
    setShowA(newState);
    setShowB(newState);
    setShowC(newState);
  };

  return (
    <div className="card-container">
      <div className="componentes">
        <div className="component-container">
          {showA && <Componente className="card-a" title="Componente A" />}
          <button className="button" onClick={() => setShowA(!showA)}>
            {showA ? 'Ocultar Componente A' : 'Mostrar Componente A'}
          </button>
        </div>

        <div className="component-container">
          {showB && <Componente className="card-b" title="Componente B" />}
          <button className="button" onClick={() => setShowB(!showB)}>
            {showB ? 'Ocultar Componente B' : 'Mostrar Componente B'}
          </button>
        </div>

        <div className="component-container">
          {showC && <Componente className="card-c" title="Componente C" />}
          <button className="button" onClick={() => setShowC(!showC)}>
            {showC ? 'Ocultar Componente C' : 'Mostrar Componente C'}
          </button>
        </div>
      </div>

      <div className="button-container">
        <button className="button" onClick={toggleAll}>
          {showA && showB && showC ? 'Ocultar Todos' : 'Mostrar Todos'}
        </button>
      </div>
    </div>
  );
};