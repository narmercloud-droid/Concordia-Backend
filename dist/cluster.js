import cluster from "cluster";
import os from "os";
import logger from "./logger.js";
const numCPUs = os.cpus().length;
if (cluster.isPrimary) {
    // Primary cluster management code
    logger.info({ pid: process.pid }, "Primary process is running");
    // Fork workers
    const numWorkers = process.env.CLUSTER_WORKERS
        ? parseInt(process.env.CLUSTER_WORKERS)
        : Math.max(Math.floor(numCPUs * 0.75), 2); // Use 75% of CPUs, minimum 2
    logger.info({ numWorkers }, "Spawning worker processes");
    for (let i = 0; i < numWorkers; i++) {
        cluster.fork();
    }
    // Handle worker exit and respawn
    cluster.on("exit", (worker, code, signal) => {
        if (signal) {
            logger.warn({ pid: worker.process.pid, signal }, "Worker killed by signal");
        }
        else if (code !== 0) {
            logger.error({ pid: worker.process.pid, code }, "Worker exited with error code");
            // Respawn worker on error
            logger.info("Respawning worker");
            cluster.fork();
        }
        else {
            logger.info({ pid: worker.process.pid }, "Worker exited successfully");
        }
    });
    // Graceful shutdown
    process.on("SIGTERM", () => {
        logger.info("SIGTERM signal received: closing workers");
        // Close all workers
        for (const id in cluster.workers) {
            cluster.workers[id]?.kill();
        }
        process.exit(0);
    });
    // Monitor worker health
    setInterval(() => {
        logger.info({ workersOnline: Object.keys(cluster.workers).length }, "Worker health check");
    }, 60000); // Every minute
}
else {
    // Worker process - load the main application
    logger.info({ pid: process.pid }, "Worker process started");
    // Import and start the app
    import("./index.js").catch((error) => {
        logger.error({ error }, "Failed to start worker");
        process.exit(1);
    });
    // Handle graceful shutdown in worker
    process.on("SIGTERM", () => {
        logger.info({ pid: process.pid }, "Worker received SIGTERM, shutting down gracefully");
        process.exit(0);
    });
}
