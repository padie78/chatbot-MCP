import { openai } from "../config/openaiClient";
import 'dotenv/config';



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

/**
 * Genera un texto natural y amigable a partir de datos de una herramienta.
 */
export async function humanizeToolData(tool: string, data: any): Promise<string> {
  let prompt = "";

  if (tool === "getOrdersByUser") {
    prompt = `
Estos son los datos de las órdenes del usuario:
${JSON.stringify(data, null, 2)}

Por favor escribe un resumen en lenguaje natural, sencillo y amigable, explicando qué productos compró el usuario, las cantidades y el total, sin usar JSON ni datos técnicos. Como si le contaras a un amigo.
`;
  } else if (tool === "getUser") {
    prompt = `
Estos son los datos del usuario:
${JSON.stringify(data, null, 2)}

Por favor genera un texto humano claro y amigable que presente al usuario, sin usar JSON ni datos técnicos.
`;
  } else {
    prompt = `
Estos son los datos obtenidos:
${JSON.stringify(data, null, 2)}

Por favor escribe un resumen claro y amigable en lenguaje natural para un usuario final, sin usar JSON ni formatos técnicos.
`;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'anthropic/claude-sonnet-4',
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content?.trim() || "No se pudo generar un resumen.";
  } catch (error) {
    console.error("Error generando texto humano con OpenAI:", error);
    return "Lo siento, no pude generar un resumen para esa información.";
  }
}

/**
 * Genera una respuesta amigable, casual y natural cuando no se usa ninguna herramienta.
 */
export async function generateFriendlyResponse(message: string): Promise<string> {
  const prompt = `
Eres un asistente amigable y conversacional.

El usuario dijo: "${message}"

Responde con un texto natural, humano y amigable, usando saludos, respuestas triviales o conversación ligera.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'anthropic/claude-sonnet-4',
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.8,
    });

    return completion.choices[0]?.message?.content?.trim() || "Hola, ¿en qué puedo ayudarte?";
  } catch (error) {
    console.error("Error generando respuesta amigable con OpenAI:", error);
    return "Hola, ¿en qué puedo ayudarte?";
  }
}
