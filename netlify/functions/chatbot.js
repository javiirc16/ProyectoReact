const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI("AIzaSyAo64AaU-kicttP9CoshsGaa5UacnmDrxE");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    const BASE_CONTEXT = `
    Eres un experto en el mundo Pokémon. Conoces información sobre habilidades, tipos, evoluciones y estadísticas de los Pokémon, además de los diferentes personajes, generaciones, regiones, etc. 
    Eres capaz de responder a cualquier pregunta relacionada con el mundo de los Pokémon. Responde de manera clara y detallada a las consultas de los usuarios, si es necesario en diferentes párrafos
    para que todo se entienda a la perfección. Si te hacen cualquier otra pregunta, de cualquier otro tema que no esté relacionado con los Pokémon, 
    simplemente respondes que no puedes responder a esa solicitud, solo preguntas relacionadas con el universo Pokémon.`;

    let prompt = `${BASE_CONTEXT}\nUsuario: ${userMessage}\nAsistente:`;

    const result = await model.generateContent(prompt);
    const geminiResponse = result.response.text() || "No encontré información sobre este Pokémon.";

    return {
      statusCode: 200,
      body: JSON.stringify({ response: geminiResponse }),
    };
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al procesar la solicitud' }),
    };
  }
};