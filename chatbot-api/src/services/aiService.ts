import fetch from "node-fetch";

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
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3:latest",
        prompt,
        stream: false
      })
    });

    const data = await res.json() as { response: string };
    const text = data.response.trim();

    try {
      const jsonResponse = JSON.parse(text);
      if (!jsonResponse.tool) {
        return { tool: "none" };
      }
      return jsonResponse;
    } catch {
      // No pudo parsear, asumimos que no hay tool
      return { tool: "none" };
    }

  } catch (error) {
    console.error("Error usando modelo local:", error);
    return { tool: "none" };
  }
}
