import { env } from "./config/env.ts";
import logger from "./utils/logger.ts";
import { runLifecycleChecks } from "./jobs/lifecycleScheduler.ts";

async function main() {
  logger.info({ environment: env.NODE_ENV }, "Worker dyno starting");

  try {
    await runLifecycleChecks();
    logger.info("Worker lifecycle checks completed");
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, "Worker lifecycle checks failed");
    process.exit(1);
  }
}

main();
