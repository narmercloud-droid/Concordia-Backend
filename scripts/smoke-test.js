import axios from "axios";

async function run() {
  const base = process.env.SMOKE_URL || "http://localhost:4000";

  const endpoints = [
    "/api/health",
    "/api/health/deep"
  ];

  for (const ep of endpoints) {
    try {
      const res = await axios.get(base + ep);
      console.log(`[OK] ${ep}`, res.status);
    } catch (err) {
      console.error(`[FAIL] ${ep}`, err.message);
    }
  }
}

run();
