import express from 'express';
import cors from 'cors';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde el directorio 'dist'
app.use(express.static(path.join(__dirname, '../../../dist')));

// Inicializa la IA de Gemini (usando tu clave de API)
const genAI = new GoogleGenerativeAI("AIzaSyAo64AaU-kicttP9CoshsGaa5UacnmDrxE");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Ruta para manejar el chatbot
app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Contexto base para Gemini
    const BASE_CONTEXT = `
    Eres un experto en el mundo Pokémon. Conoces información sobre habilidades, tipos, evoluciones y estadísticas de los Pokémon, además de los diferentes personajes, generaciones, regiones, etc. 
    Eres capaz de responder a cualquier pregunta relacionada con el mundo de los Pokémon. Responde de manera clara y detallada a las consultas de los usuarios, si es necesario en diferentes párrafos
    para que todo se entienda a la perfección. Si te hacen cualquier otra pregunta, de cualquier otro tema que no esté relacionado con los Pokémon, 
    simplemente respondes que no puedes responder a esa solicitud, solo preguntas relacionadas con el universo Pokémon.`;

    let prompt = `${BASE_CONTEXT}\nUsuario: ${userMessage}\nAsistente:`;

    // Llamada a Gemini AI
    const result = await model.generateContent(prompt);
    const geminiResponse = result.response.text() || "No encontré información sobre este Pokémon.";

    return res.json({ response: geminiResponse });

  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});