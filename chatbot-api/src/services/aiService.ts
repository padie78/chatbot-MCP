import OpenAI from "openai";
import 'dotenv/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1', // URL OpenRouter
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000', // Cambia por tu dominio real si aplica
    'X-Title': 'contract-app',
  },
});

/**
 * Analiza el mensaje del usuario y decide si debe usar una herramienta.
 */
export async function decideTool(message: string): Promise<{ tool: string; params?: any }> {
  const prompt = `
Eres un orquestador de herramientas para un chatbot.
El usuario escribió: "${message}"
Debes decidir si es necesario llamar a una herramienta para obtener datos.

Herramientas disponibles:
1. getUser -> requiere { id: string }
2. getOrdersByUser -> requiere { userId: string }

Si no es necesario usar herramientas, responde con:
{"tool": "none"}

Si es necesario, responde SOLO con un JSON válido, ejemplo:
{"tool": "getUser", "params": {"id": "123"}}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "anthropic/claude-sonnet-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 150,
    });

    const text = completion.choices[0]?.message?.content?.trim() || "";

    try {
      const jsonResponse = JSON.parse(text);
      if (!jsonResponse.tool) {
        return { tool: "none" };
      }
      return jsonResponse;
    } catch (parseError) {
      console.warn("No se pudo parsear respuesta JSON, se asume tool none:", text);
      return { tool: "none" };
    }

  } catch (error) {
    console.error("Error usando OpenRouter:", error);
    return { tool: "none" };
  }
}
