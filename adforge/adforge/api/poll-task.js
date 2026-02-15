module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  const { taskId } = req.query;
  if (!taskId) return res.status(400).json({ error: "taskId required" });
  const apiKey = process.env.RUNWAY_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "RUNWAY_API_KEY not set" });
  try {
    const response = await fetch(`https://api.runwayml.com/v1/tasks/${taskId}`, {
      headers: { "Authorization": `Bearer ${apiKey}`, "X-Runway-Version": "2024-11-06" },
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
