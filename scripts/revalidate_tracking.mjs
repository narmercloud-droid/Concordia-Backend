import fs from "fs";
import express from "express";
import cors from "cors";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not set. Set it in environment or .env before running this script.");
  process.exit(1);
}
const { default: trackRoutes } = await import("../dist/routes/track.js");
const orderId = "a31e9f96-275a-4099-b402-c2074415e735";
const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  if (typeof res.tson !== "function") {
    res.tson = (payload) => res.json(payload);
  }
  next();
});
app.use("/api", trackRoutes);

const port = 4000;
const server = app.listen(port);

async function getJson(path) {
  const res = await fetch(`http://127.0.0.1:${port}${path}`);
  const data = await res.text();
  try {
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Invalid JSON from ${path}: ${data}`);
  }
}

try {
  const orderResp = await getJson(`/api/track/order/${orderId}`);
  const token = orderResp?.tracking_token;
  if (!token) {
    throw new Error(`Missing tracking_token in /api/track/order response: ${JSON.stringify(orderResp)}`);
  }

  const trackResp = await getJson(`/api/track/${token}`);
  const timeline = Array.isArray(trackResp.timeline) ? trackResp.timeline : [];
  const noNullTimestamps = timeline.every((event) => event.timestamp != null);
  const timestamps = timeline.map((event) => new Date(event.timestamp).getTime());
  const sortedAsc = timestamps.every((t, index) => index === 0 || t >= timestamps[index - 1]);
  const firstIsCreated = timeline.length > 0 && timeline[0].status === "created";
  const seen = new Set();
  const duplicates = timeline.some((event) => {
    const key = `${event.status}|${event.timestamp}`;
    if (seen.has(key)) return true;
    seen.add(key);
    return false;
  });
  const statusMatchesLast = trackResp.order && timeline.length > 0 ? trackResp.order.status === timeline[timeline.length - 1].status : null;

  const result = {
    order: {
      id: orderId,
      tracking_token: token,
      status: orderResp.status
    },
    timeline,
    checks: {
      timelineExists: Array.isArray(trackResp.timeline),
      sortedAsc,
      firstIsCreated,
      noNullTimestamps,
      duplicates,
      statusMatchesLast
    },
    errors: []
  };

  fs.writeFileSync("tracking_validation_result.json", JSON.stringify(result, null, 2), "utf8");
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  const result = { order: { id: orderId }, timeline: [], checks: {}, errors: [{ message: error.message, stack: error.stack }] };
  fs.writeFileSync("tracking_validation_result.json", JSON.stringify(result, null, 2), "utf8");
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
} finally {
  await new Promise((resolve) => server.close(resolve));
}
