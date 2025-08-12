import { getUser } from "../tools/getUser";
import { getOrdersByUser } from "../tools/getOrdersByUser";

type ToolName = "getUser" | "getOrdersByUser";

const tools: Record<ToolName, (params: any) => Promise<any>> = {
  getUser,
  getOrdersByUser,
};

export async function invokeTool(toolName: string, params: any): Promise<any> {
  if (!(toolName in tools)) {
    throw new Error(`Herramienta "${toolName}" no encontrada.`);
  }

  // Aquí puedes agregar validaciones o lógica antes de llamar a la herramienta
  return await tools[toolName as ToolName](params);
}
