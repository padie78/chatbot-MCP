import app from "./server";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor MCP simulado corriendo en http://localhost:${PORT}/invokeTool`);
});
