import path from "node:path";
import express from "express";

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, app: "samassa-technologie", timestamp: new Date().toISOString() });
});

const distPath = path.resolve(import.meta.dirname, "..", "..", "dist", "public");
app.use(express.static(distPath));

app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Samassa Technologie server listening on http://localhost:${port}`);
});
