import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Función para alternar el estado de apertura del chatbot
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  // Enviar mensaje de bienvenida automáticamente cuando el chatbot se abre
  useEffect(() => {
    if (isOpen) {
      const welcomeMessage = {
        sender: 'bot',
        text: '¡Hola! Soy tu asistente Pokémon. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre cualquier Pokémon o tema relacionado con el universo Pokémon.',
      };
      setMessages((prevMessages) => [...prevMessages, welcomeMessage]);
    }
  }, [isOpen]); // Se ejecuta cada vez que `isOpen` cambia

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');

    try {
      const response = await axios.post('/.netlify/functions/chatbot', {
        message: input,
      });

      const botResponse = response?.data?.response || "Lo siento, no tengo información.";
      const botMessage = { sender: 'bot', text: botResponse };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error en la conexión:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: 'Lo siento, no pude procesar tu solicitud.' },
      ]);
    }
  };

  // Detectar cuando el usuario presiona "Enter"
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();  // Prevenir el comportamiento predeterminado (que puede hacer que se envíe un formulario)
      sendMessage();  // Llamar a la función para enviar el mensaje
    }
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle" onClick={toggleChatbot}>
        💬
      </button>
      {isOpen && (
        <div className="chatbot-popup">
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}  // Detectar el evento de tecla "Enter"
              placeholder="Escribe tu mensaje..."
            />
            <button onClick={sendMessage}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
};