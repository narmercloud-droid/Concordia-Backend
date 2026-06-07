import type { Request } from "express";
import { wrap, fail } from "../../contracts/api.js";
import { managerHasPermission } from "../../services/manager/managerPermissions.service.ts";
import * as presetService from "../../services/manager/extraPreset.service.ts";

function branchId(req: Request) {
  return (req as any).managerBranchId as string;
}

async function requireStructureEdit(req: Request) {
  const user = (req as any).user;
  const allowed = await managerHasPermission(user?.role, "menu_edit_structure");
  if (!allowed) throw fail("FORBIDDEN", "Cannot edit extra presets");
}

export const listExtraPresets = wrap(async (req: Request) => {
  return presetService.listExtraPresets(branchId(req));
});

export const createExtraPreset = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const name = String(req.body?.name ?? "").trim();
  if (!name) throw fail("INVALID_INPUT", "Preset name is required");
  try {
    return await presetService.createExtraPreset(branchId(req), req.body);
  } catch (err: any) {
    throw fail("INVALID_INPUT", err?.message ?? "Could not create preset");
  }
});

export const updateExtraPreset = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const presetId = req.params.presetId;
  if (!presetId) throw fail("INVALID_INPUT", "preset id is required");
  try {
    return await presetService.updateExtraPreset(branchId(req), presetId, req.body ?? {});
  } catch (err: any) {
    throw fail("NOT_FOUND", err?.message ?? "Preset not found");
  }
});

export const deleteExtraPreset = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const presetId = req.params.presetId;
  if (!presetId) throw fail("INVALID_INPUT", "preset id is required");
  try {
    return await presetService.deleteExtraPreset(branchId(req), presetId);
  } catch (err: any) {
    throw fail("NOT_FOUND", err?.message ?? "Preset not found");
  }
});

export const addPresetOption = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const presetId = req.params.presetId;
  if (!presetId || !req.body?.name?.trim()) throw fail("INVALID_INPUT", "name is required");
  try {
    return await presetService.addPresetOption(branchId(req), presetId, req.body);
  } catch (err: any) {
    throw fail("NOT_FOUND", err?.message ?? "Preset not found");
  }
});

export const updatePresetOption = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const optionId = req.params.optionId;
  if (!optionId) throw fail("INVALID_INPUT", "option id is required");
  try {
    return await presetService.updatePresetOption(branchId(req), optionId, req.body ?? {});
  } catch (err: any) {
    throw fail("NOT_FOUND", err?.message ?? "Option not found");
  }
});

export const importDefaultPresets = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  try {
    return await presetService.importDefaultExtraPresets(branchId(req));
  } catch (err: any) {
    throw fail("INVALID_INPUT", err?.message ?? "Import failed");
  }
});

export const deletePresetOption = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const optionId = req.params.optionId;
  if (!optionId) throw fail("INVALID_INPUT", "option id is required");
  try {
    return await presetService.deletePresetOption(branchId(req), optionId);
  } catch (err: any) {
    throw fail("NOT_FOUND", err?.message ?? "Option not found");
  }
});
