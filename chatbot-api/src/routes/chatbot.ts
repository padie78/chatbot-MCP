import http from "http";
import express from "express";
import { Server } from "socket.io";
import { decideTool } from "../services/aiService";
import { callTool } from "../services/toolService";

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
        console.log("Llega una petición a /mcp con body:", data);
        const msgStr = data.body.toString();
        console.log("Mensaje recibido (body):", msgStr);

        if (!msgStr.trim()) {
          console.log("Mensaje vacío recibido");
          socket.emit("error", { error: "El mensaje es requerido" });
          return;
        }

        console.log("Llamando a decideTool con mensaje:", msgStr);
        const decision = await decideTool(msgStr);
        console.log("Respuesta de decideTool:", decision);

        if (decision.tool && decision.tool !== "none") {
          console.log(`Se usará la herramienta: ${decision.tool} con params:`, decision.params);
          const toolData = await callTool(decision.tool, decision.params);
          console.log("Datos devueltos por la herramienta:", toolData);

          socket.emit("answer", {
            answer: `Datos obtenidos usando ${decision.tool}: ${JSON.stringify(toolData)}`,
          });
          return;
        }

        console.log("No se usará ninguna herramienta, enviando respuesta directa", msgStr);
        socket.emit("answer", { answer: `Respuesta directa sin herramientas: ${msgStr}` });
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
