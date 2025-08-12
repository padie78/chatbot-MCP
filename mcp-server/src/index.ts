import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { getUser } from "./tools/getUser";
import { getOrdersByUser } from "./tools/getOrdersByUser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

const tools = {
  getUser,
  getOrdersByUser,
};

app.post("/invokeTool", async (req, res) => {
  try {
    console.log(`invokeTool`);
    const { tool, params } = req.body;
    console.log(`Recibida petición para herramienta: "${tool}" con parámetros:`, params);

    if (!tool) {
      console.warn("Falta el campo 'tool' en el body");
      return res.status(400).json({ error: "Falta el campo 'tool'" });
    }

    if (!(tool in tools)) {
      console.warn(`Herramienta "${tool}" no encontrada`);
      return res.status(404).json({ error: `Tool "${tool}" no encontrada` });
    }

    const toolName = tool as keyof typeof tools;

    console.log(`Ejecutando herramienta: "${toolName}"`);
    const data = await tools[toolName](params || {});

    console.log(`Resultado de herramienta "${toolName}":`, data);

    res.json({
      tool: tool,
      success: true,
      data,
    });
  } catch (error) {
    console.error(`Error ejecutando herramienta "${req.body?.tool}":`, error);
    res.status(500).json({
      tool: req.body?.tool,
      success: false,
      error: "Error interno del servidor",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor MCP simulado corriendo en http://localhost:${PORT}/invokeTool`);
});
