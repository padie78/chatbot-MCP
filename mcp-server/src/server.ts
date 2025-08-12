import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/invokeTool", (req, res) => {
  res.json({ message: "Funciona!" });
});

export default app;
