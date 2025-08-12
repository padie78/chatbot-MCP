import { startWebSocketServer } from "./routes/chatbot";

const PORT_WS = 3000; // Puerto para WebSocket
startWebSocketServer(PORT_WS);
