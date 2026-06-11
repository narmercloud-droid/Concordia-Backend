import logger from "../logger.js";
import { runAutomationForAllBranches } from "../services/customer/branchAutomation.service.js";
import { startCampaignScheduler } from "./campaignScheduler.js";
const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
export async function runBranchMarketingJobs() {
    try {
        await runAutomationForAllBranches();
    }
    catch (err) {
        logger.error({ err }, "[BranchMarketing] Automation failed");
    }
}
export function startBranchMarketingScheduler() {
    startCampaignScheduler();
    runBranchMarketingJobs().catch((err) => {
        logger.error({ err }, "[BranchMarketing] Initial run failed");
    });
    return setInterval(() => {
        runBranchMarketingJobs().catch((err) => {
            logger.error({ err }, "[BranchMarketing] Scheduled run failed");
        });
    }, SIX_HOURS_MS);
}
