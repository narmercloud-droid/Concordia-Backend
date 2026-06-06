import { prisma } from "../../prisma/client.ts";

export async function resolveBranchByCode(branchCode: string) {
  const normalized = branchCode.trim().toUpperCase();
  const configs = await prisma.branchConfig.findMany();

  for (const config of configs) {
    const json = config.configJson as Record<string, unknown>;
    const code = String(json.terminalCode ?? json.branchCode ?? "").toUpperCase();
    if (code && code === normalized) {
      const branch = await prisma.branch.findUnique({ where: { id: config.branchId } });
      if (branch) {
        return { branch, configJson: json };
      }
    }
  }

  const activation = await prisma.activationCode.findFirst({
    where: {
      code: normalized,
      used: false,
      expiresAt: { gt: new Date() }
    },
    include: { Branch: true }
  });

  if (activation) {
    return { branch: activation.Branch, configJson: {}, activationCode: activation };
  }

  return null;
}
