import fetch from "node-fetch";

interface ToolResponse {
  tool: string;
  success: boolean;
  data?: any;
  error?: string;
}

export async function invokeTool(tool: string, params: any) {
  try {
    console.log(`Invocando herramienta ${tool} con params:`, params);
    const response = await fetch("http://localhost:5000/invokeTool", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tool, params }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`Error HTTP: ${response.status} - ${text}`);
      throw new Error(text || response.statusText);
    }

    const data = (await response.json()) as ToolResponse;

    console.log(`Respuesta de herramienta ${tool}:`, data);

    if (!data.success) {
      throw new Error(data.error || "Error desconocido");
    }

    return data.data;
  } catch (error) {
    console.error(`Error ejecutando ${tool}:`, error);
    throw error;
  }
}
