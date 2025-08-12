import { Router, Request, Response } from "express";
import { invokeTool } from "../services/toolService";

const router = Router();

router.post("/invokeTool", async (req: Request, res: Response) => {
  try {
    const { tool, params } = req.body;

    if (!tool) {
      return res.status(400).json({ error: "Falta el campo 'tool'" });
    }

    const data = await invokeTool(tool, params || {});

    return res.json({ tool, success: true, data });
  } catch (error: unknown) {
    console.error(`Error ejecutando herramienta "${req.body?.tool}":`, error);
    const message = error instanceof Error ? error.message : "Error interno del servidor";
    return res.status(500).json({
        tool: req.body?.tool,
        success: false,
        error: message,
    });
}

});

export default router;
