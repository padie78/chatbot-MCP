import { invokeTool } from "../mcp/mcpClient";

/**
 * Llama a una herramienta registrada en el MCP Server
 * @param tool - nombre de la herramienta (por ejemplo: "getUser" o "getOrdersByUser")
 * @param params - parámetros requeridos por la herramienta
 */
export async function callTool(tool: string, params: any) {
  try {
    const result = await invokeTool(tool, params);
    return result;
  } catch (error) {
    console.error(`Error en toolService con ${tool}:`, error);
    throw error;
  }
}
