import { decideTool } from "../services/aiService";
import { callTool } from "../services/toolService";
import { humanizeToolData, generateFriendlyResponse } from "../services/aiService";

export async function handleMessage(msgStr: string) {
  if (!msgStr.trim()) {
    throw new Error("El mensaje es requerido");
  }

  const decision = await decideTool(msgStr);

  if (decision.tool && decision.tool !== "none") {
    const toolData = await callTool(decision.tool, decision.params);
    return humanizeToolData(decision.tool, toolData);
  } else {
    return generateFriendlyResponse(msgStr);
  }
}
