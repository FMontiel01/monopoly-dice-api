import express from "express";
import cors from "cors";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:5500";

// Allow CORS only for your static site
app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    methods: ["GET"],
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serves ONLY a test page (not your monopoly UI)
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Server awake", time: new Date().toISOString() });
});

// Monopoly roll: 2 dice, server generates randomness
app.get("/api/monopoly/roll", (req, res) => {
  const die1 = crypto.randomInt(1, 7);
  const die2 = crypto.randomInt(1, 7);
  const sum = die1 + die2;
  const isDouble = die1 === die2;

  res.json({ die1, die2, sum, isDouble, time: new Date().toISOString() });
});

// INTENTIONAL CORS FAIL ENDPOINT (no CORS headers)
// We'll avoid the cors middleware by making a separate mini-app route:
app.get("/api/nocors", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ ok: true, message: "This endpoint intentionally has no CORS." }));
});

app.listen(PORT, () => console.log(`API running on port ${PORT}`));