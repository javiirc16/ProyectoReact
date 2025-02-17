import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './SpeechRecognition.css';

// Componente que permite el reconocimiento de voz
export const ReconocimientoVoz = () => {
  // Estados para el texto escrito, el texto enviado y si se está escuchando
  const [inputText, setInputText] = useState('');
  const [submittedText, setSubmittedText] = useState('');
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);

  // Verifica si el navegador soporta reconocimiento de voz
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <div>El navegador no soporta reconocimiento de voz</div>;
  }

  // Actualiza el texto escrito
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // Envía el texto escrito o hablado
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmittedText(inputText || transcript);
    setInputText('');
    resetTranscript();
  };
  // Inicia el reconocimiento de voz
  const handleStartListening = () => {
    SpeechRecognition.startListening({ continuous: true });
    setIsListening(true);
  };

  // Detiene el reconocimiento de voz
  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
    setInputText(transcript);
  };

  return (
    <div className="card">
      <div className="card-content">
        <h2>Reconocimiento de Voz</h2>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Escribe o usa el micrófono"
          />
          <button type="submit" className="boton" >Enviar</button>
        </form>
        <button onClick={handleStartListening} className="boton" disabled={isListening}>
          {isListening ? 'Escuchando...' : 'Escuchar'}
        </button>
        <button onClick={handleStopListening} className="boton" disabled={!isListening}>
          Detener
        </button>
        <p><b>TEXTO ENVIADO: </b>{submittedText}</p>
      </div>
    </div>
  );
};