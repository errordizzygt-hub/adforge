import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "25mb" }));

const RUNWAY_API = "https://api.runwayml.com/v1";
const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";

// ── Anthropic proxy ──────────────────────────────────────────────
app.post("/api/claude", async (req, res) => {
  try {
    const response = await fetch(ANTHROPIC_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Runway: start image-to-video generation ─────────────────────
app.post("/api/runway/generate", async (req, res) => {
  try {
    const { promptImage, promptText, duration, ratio } = req.body;
    const response = await fetch(`${RUNWAY_API}/image_to_video`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RUNWAY_API_KEY}`,
        "X-Runway-Version": "2024-11-06",
      },
      body: JSON.stringify({
        model: "gen4_turbo",
        promptImage,
        promptText,
        duration: duration <= 5 ? 5 : 10,
        ratio,
        watermark: false,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.json(data); // { id: "task-id" }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Runway: poll task status ─────────────────────────────────────
app.get("/api/runway/task/:id", async (req, res) => {
  try {
    const response = await fetch(`${RUNWAY_API}/tasks/${req.params.id}`, {
      headers: {
        Authorization: `Bearer ${process.env.RUNWAY_API_KEY}`,
        "X-Runway-Version": "2024-11-06",
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Runway: delete task ──────────────────────────────────────────
app.delete("/api/runway/task/:id", async (req, res) => {
  try {
    await fetch(`${RUNWAY_API}/tasks/${req.params.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.RUNWAY_API_KEY}`,
        "X-Runway-Version": "2024-11-06",
      },
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ AdForge server running on http://localhost:${PORT}`));
