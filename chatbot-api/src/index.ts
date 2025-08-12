import { startWebSocketServer } from './server';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

startWebSocketServer(PORT);
