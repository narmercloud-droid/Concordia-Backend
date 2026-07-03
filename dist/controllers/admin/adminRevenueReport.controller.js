import { wrap } from "../../contracts/api.js";
import { getRevenueReport } from "../../services/admin/revenueReport.service.js";
import { getRevenueReportPdf } from "../../services/admin/revenueReportPdf.service.js";
import { berlinYmd } from "../../utils/berlinTime.js";
import { managerHasPermission } from "../../services/manager/managerPermissions.service.js";
import { resolveManagerBranchId } from "../../middleware/managerAccess.js";
function parseYmd(value, fallback) {
    const raw = String(value ?? "").trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : fallback;
}
function resolveBranchId(req) {
    const branchId = resolveManagerBranchId(req);
    if (!branchId)
        throw new Error("branchId is required");
    return branchId;
}
async function assertDashboardAccess(req) {
    const user = req.user;
    const allowed = await managerHasPermission(user?.role, "dashboard");
    if (!allowed)
        throw new Error("Forbidden");
}
export const AdminRevenueReportController = {
    report: wrap(async (req) => {
        await assertDashboardAccess(req);
        const today = berlinYmd();
        const from = parseYmd(req.query.from, today);
        const to = parseYmd(req.query.to, from);
        const branchId = resolveBranchId(req);
        return getRevenueReport({ branchId, from, to });
    }),
    pdf: async (req, res) => {
        try {
            await assertDashboardAccess(req);
            const today = berlinYmd();
            const from = parseYmd(req.query.from, today);
            const to = parseYmd(req.query.to, from);
            const branchId = resolveBranchId(req);
            const { pdf } = await getRevenueReportPdf({ branchId, from, to });
            const filename = `umsatzbericht-${branchId}-${from}${to !== from ? `-${to}` : ""}.pdf`;
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
            res.send(pdf);
        }
        catch (err) {
            const status = err?.message === "Forbidden" ? 403 : 400;
            res.status(status).json({ error: err?.message ?? "Could not generate PDF" });
        }
    }
};
