import { randomUUID } from "crypto";
import { prisma } from "../../prisma/client.js";
import { invalidateBranchMenuCache } from "../customer/branchMenu.service.js";
function bumpCache(branchId) {
    invalidateBranchMenuCache(branchId);
}
export async function listExtraPresets(branchId) {
    const presets = await prisma.branchExtraPreset.findMany({
        where: { branchId },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        include: {
            options: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] },
            categories: { include: { category: { select: { id: true, name: true } } } }
        }
    });
    return presets.map((p) => ({
        id: p.id,
        name: p.name,
        required: p.required,
        minSelect: p.minSelect,
        maxSelect: p.maxSelect,
        sortOrder: p.sortOrder,
        options: p.options.map((o) => ({
            id: o.id,
            name: o.name,
            price: o.price,
            sortOrder: o.sortOrder
        })),
        categoryIds: p.categories.map((c) => c.categoryId),
        categories: p.categories.map((c) => c.category)
    }));
}
export async function createExtraPreset(branchId, data) {
    const presetId = randomUUID();
    const preset = await prisma.branchExtraPreset.create({
        data: {
            id: presetId,
            branchId,
            name: data.name.trim(),
            required: data.required ?? false,
            minSelect: data.minSelect ?? 0,
            maxSelect: data.maxSelect ?? 5,
            sortOrder: data.sortOrder ?? 0,
            options: {
                create: (data.options ?? []).map((o, i) => ({
                    id: randomUUID(),
                    name: o.name.trim(),
                    price: Number(o.price) || 0,
                    sortOrder: i
                }))
            },
            categories: {
                create: (data.categoryIds ?? []).map((categoryId) => ({ categoryId }))
            }
        },
        include: {
            options: true,
            categories: true
        }
    });
    bumpCache(branchId);
    return preset;
}
export async function updateExtraPreset(branchId, presetId, data) {
    const existing = await prisma.branchExtraPreset.findFirst({
        where: { id: presetId, branchId }
    });
    if (!existing)
        throw new Error("Preset not found");
    if (data.categoryIds) {
        await prisma.branchExtraPresetCategory.deleteMany({ where: { presetId } });
        if (data.categoryIds.length) {
            await prisma.branchExtraPresetCategory.createMany({
                data: data.categoryIds.map((categoryId) => ({ presetId, categoryId }))
            });
        }
    }
    const updated = await prisma.branchExtraPreset.update({
        where: { id: presetId },
        data: {
            name: data.name?.trim() ?? undefined,
            required: data.required ?? undefined,
            minSelect: data.minSelect ?? undefined,
            maxSelect: data.maxSelect ?? undefined,
            sortOrder: data.sortOrder ?? undefined
        },
        include: {
            options: { orderBy: { sortOrder: "asc" } },
            categories: { include: { category: true } }
        }
    });
    bumpCache(branchId);
    return updated;
}
export async function deleteExtraPreset(branchId, presetId) {
    const existing = await prisma.branchExtraPreset.findFirst({
        where: { id: presetId, branchId }
    });
    if (!existing)
        throw new Error("Preset not found");
    await prisma.branchExtraPreset.delete({ where: { id: presetId } });
    bumpCache(branchId);
    return { success: true };
}
export async function addPresetOption(branchId, presetId, data) {
    const existing = await prisma.branchExtraPreset.findFirst({
        where: { id: presetId, branchId }
    });
    if (!existing)
        throw new Error("Preset not found");
    const option = await prisma.branchExtraPresetOption.create({
        data: {
            id: randomUUID(),
            presetId,
            name: data.name.trim(),
            price: Number(data.price) || 0
        }
    });
    bumpCache(branchId);
    return option;
}
export async function updatePresetOption(branchId, optionId, data) {
    const option = await prisma.branchExtraPresetOption.findUnique({
        where: { id: optionId },
        include: { preset: true }
    });
    if (!option || option.preset.branchId !== branchId)
        throw new Error("Option not found");
    const updated = await prisma.branchExtraPresetOption.update({
        where: { id: optionId },
        data: {
            name: data.name?.trim() ?? undefined,
            price: data.price != null ? Number(data.price) : undefined
        }
    });
    bumpCache(branchId);
    return updated;
}
export async function deletePresetOption(branchId, optionId) {
    const option = await prisma.branchExtraPresetOption.findUnique({
        where: { id: optionId },
        include: { preset: true }
    });
    if (!option || option.preset.branchId !== branchId)
        throw new Error("Option not found");
    await prisma.branchExtraPresetOption.delete({ where: { id: optionId } });
    bumpCache(branchId);
    return { success: true };
}
/** Preset groups linked to a menu item's branch category, for customer + manager views */
export async function getPresetAddOnGroupsForItem(branchId, categoryId) {
    if (!categoryId)
        return [];
    const presets = await prisma.branchExtraPreset.findMany({
        where: {
            branchId,
            categories: { some: { categoryId } }
        },
        include: {
            options: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    });
    return presets.map((preset) => formatPresetAsAddOnGroup(preset));
}
/** Batch-load preset add-on groups for many categories (fat menu). */
export async function getPresetAddOnGroupsForCategories(branchId, categoryIds) {
    const uniqueIds = [...new Set(categoryIds.filter((id) => Number.isFinite(id) && id > 0))];
    const result = new Map();
    if (!uniqueIds.length)
        return result;
    const presets = await prisma.branchExtraPreset.findMany({
        where: {
            branchId,
            categories: { some: { categoryId: { in: uniqueIds } } }
        },
        include: {
            options: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] },
            categories: { select: { categoryId: true } }
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    });
    for (const categoryId of uniqueIds) {
        result.set(categoryId, []);
    }
    for (const preset of presets) {
        const group = formatPresetAsAddOnGroup(preset);
        for (const link of preset.categories) {
            const list = result.get(link.categoryId);
            if (list)
                list.push(group);
        }
    }
    return result;
}
function formatPresetAsAddOnGroup(preset) {
    return {
        id: `preset-${preset.id}`,
        name: preset.name,
        required: preset.required,
        minSelect: preset.minSelect,
        maxSelect: preset.maxSelect,
        isPreset: true,
        options: preset.options.map((o) => ({
            id: `preset-${preset.id}-${o.id}`,
            name: o.name,
            price: o.price
        }))
    };
}
const KEMPEN_DEFAULT_PRESETS = [
    {
        name: "Gemüse",
        options: [
            "Ananas", "Artischocken", "Broccoli", "Champignons", "Cherry Tomaten",
            "Knoblauch", "Mais", "Oliven", "Paprika", "Peperoni", "Rucola", "Spargel",
            "Spinat", "Tomaten", "Zwiebeln", "scharfe Peperoni"
        ].map((name) => ({ name, price: name === "Knoblauch" ? 0 : 0.5 }))
    },
    {
        name: "Fleisch & Wurst",
        options: [
            "Dönerfleisch", "Hackfleischsauce", "Hinterschinken", "Hähnchenbruststreifen",
            "Parmaschinken", "Salami", "Sucuk"
        ].map((name) => ({ name, price: name.includes("Hähnchen") ? 1.5 : 1 }))
    },
    {
        name: "Meeresfrüchte",
        options: ["Krabben", "Lachs", "Meeresfrüchte", "Thunfisch"].map((name) => ({
            name,
            price: name === "Thunfisch" ? 1 : 1.5
        }))
    },
    {
        name: "Saucen & Käse",
        options: [
            "Fetakäse", "Gorgonzola", "Gouda Käse", "Mozzarella", "Parmesankäse",
            "Sauce Hollandaise"
        ].map((name) => ({ name, price: 1 }))
    }
];
export async function importDefaultExtraPresets(branchId) {
    const existing = await prisma.branchExtraPreset.count({ where: { branchId } });
    if (existing > 0)
        throw new Error("Presets already exist — delete them first or add manually");
    const created = [];
    for (const [i, preset] of KEMPEN_DEFAULT_PRESETS.entries()) {
        const row = await createExtraPreset(branchId, {
            name: preset.name,
            sortOrder: i,
            maxSelect: 10,
            options: preset.options
        });
        created.push(row);
    }
    return { imported: created.length };
}
