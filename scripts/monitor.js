import axios from "axios";

async function monitor() {
  const url = process.env.MONITOR_URL || "http://localhost:4000/api/health";
  try {
    await axios.get(url);
    console.log("Monitor OK");
  } catch (err) {
    console.error("Monitor FAIL:", err.message);
  }
}

monitor();
