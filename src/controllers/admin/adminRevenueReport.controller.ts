import type { Request, Response } from "express";
import { wrap } from "../../contracts/api.ts";
import { getRevenueReport } from "../../services/admin/revenueReport.service.ts";
import { getRevenueReportPdf } from "../../services/admin/revenueReportPdf.service.ts";
import { berlinYmd } from "../../utils/berlinTime.ts";
import { managerHasPermission } from "../../services/manager/managerPermissions.service.ts";
import { resolveManagerBranchId } from "../../middleware/managerAccess.ts";

function parseYmd(value: unknown, fallback: string) {
  const raw = String(value ?? "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : fallback;
}

function resolveBranchId(req: Request) {
  const branchId = resolveManagerBranchId(req);
  if (!branchId) throw new Error("branchId is required");
  return branchId;
}

async function assertDashboardAccess(req: Request) {
  const user = (req as any).user;
  const allowed = await managerHasPermission(user?.role, "dashboard");
  if (!allowed) throw new Error("Forbidden");
}

export const AdminRevenueReportController = {
  report: wrap(async (req: Request) => {
    await assertDashboardAccess(req);
    const today = berlinYmd();
    const from = parseYmd(req.query.from, today);
    const to = parseYmd(req.query.to, from);
    const branchId = resolveBranchId(req);
    return getRevenueReport({ branchId, from, to });
  }),

  pdf: async (req: Request, res: Response) => {
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
    } catch (err: any) {
      const status = err?.message === "Forbidden" ? 403 : 400;
      res.status(status).json({ error: err?.message ?? "Could not generate PDF" });
    }
  }
};
