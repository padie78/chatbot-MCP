import http from "http";
import express from "express";
import { Server } from "socket.io";
import { decideTool } from "../services/aiService";
import { callTool } from "../services/toolService";
import OpenAI from "openai";
import 'dotenv/config';

// Instancia OpenAI con OpenRouter (o tu configuración)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1', // tu base URL de OpenRouter
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000', // ajusta dominio real si aplica
    'X-Title': 'chatbot-app',
  },
});

async function humanizeToolData(tool: string, data: any): Promise<string> {
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
      model: 'anthropic/claude-sonnet-4', // ejemplo: tu modelo en OpenRouter
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

async function generateFriendlyResponse(message: string): Promise<string> {
  const prompt = `
Eres un asistente amigable y conversacional.

El usuario dijo: "${message}"

Responde con un texto natural, humano y amigable, usando saludos, respuestas triviales o conversación ligera.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'anthropic/claude-sonnet-4', // ejemplo: tu modelo en OpenRouter
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

export function startWebSocketServer(serverPort: number) {
  const app = express();
  const httpServer = http.createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Cliente WS conectado:", socket.id);

    socket.on("message", async (data: { title: string; emitName: string; body: string }) => {
      try {
        const msgStr = data.body.toString().trim();
        if (!msgStr) {
          socket.emit("error", { error: "El mensaje es requerido" });
          return;
        }

        console.log("Mensaje recibido:", msgStr);

        const decision = await decideTool(msgStr);
        console.log("decideTool respondió:", decision);

        if (decision.tool && decision.tool !== "none") {
          const toolData = await callTool(decision.tool, decision.params);
          const humanText = await humanizeToolData(decision.tool, toolData);
          socket.emit("answer", { answer: humanText });
        } else {
          const friendlyResponse = await generateFriendlyResponse(msgStr);
          socket.emit("answer", { answer: friendlyResponse });
        }
      } catch (error) {
        console.error("Error WS:", error);
        socket.emit("error", { error: "Error interno del servidor" });
      }
    });

    socket.on("disconnect", () => {
      console.log("Cliente WS desconectado:", socket.id);
    });
  });

  httpServer.listen(serverPort, () => {
    console.log(`Servidor Socket.IO escuchando en http://localhost:${serverPort}`);
  });
}
