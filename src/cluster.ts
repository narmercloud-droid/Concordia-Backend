import cluster from "cluster";
import os from "os";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  // Primary cluster management code
  console.log(`🚀 Primary process ${process.pid} is running`);

  // Fork workers
  const numWorkers = process.env.CLUSTER_WORKERS 
    ? parseInt(process.env.CLUSTER_WORKERS)
    : Math.max(Math.floor(numCPUs * 0.75), 2); // Use 75% of CPUs, minimum 2

  console.log(`🔄 Spawning ${numWorkers} worker processes...`);

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  // Handle worker exit and respawn
  cluster.on("exit", (worker, code, signal) => {
    if (signal) {
      console.log(`⚠️  Worker ${worker.process.pid} was killed by signal: ${signal}`);
    } else if (code !== 0) {
      console.log(`❌ Worker ${worker.process.pid} exited with error code: ${code}`);
      // Respawn worker on error
      console.log(`🔄 Respawning worker...`);
      cluster.fork();
    } else {
      console.log(`✅ Worker ${worker.process.pid} exited successfully`);
    }
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP server");
    
    // Close all workers
    for (const id in cluster.workers) {
      cluster.workers[id]?.kill();
    }
    
    process.exit(0);
  });

  // Monitor worker health
  setInterval(() => {
    console.log(`✅ Health check: ${Object.keys(cluster.workers).length} workers online`);
  }, 60000); // Every minute

} else {
  // Worker process - load the main application
  console.log(`🔧 Worker process ${process.pid} started`);

  // Import and start the app
  import("./index.js").catch((error) => {
    console.error("Failed to start worker:", error);
    process.exit(1);
  });

  // Handle graceful shutdown in worker
  process.on("SIGTERM", () => {
    console.log(`Worker ${process.pid} received SIGTERM, shutting down gracefully`);
    process.exit(0);
  });
}


