import http from "http";
import express from "express";
import { Server } from "socket.io";
import { handleMessage } from "./handlers/messageHandler";

export function startWebSocketServer(serverPort: number) {
  const app = express();
  const httpServer = http.createServer(app);

  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log("Cliente WS conectado:", socket.id);

    socket.on("message", async (data: { title: string; emitName: string; body: string }) => {
      try {
        const msgStr = data.body.toString();
        const response = await handleMessage(msgStr);
        socket.emit("answer", { answer: response });
      } catch (error: any) {
        console.error("Error WS:", error.message || error);
        socket.emit("error", { error: error.message || "Error interno del servidor" });
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
