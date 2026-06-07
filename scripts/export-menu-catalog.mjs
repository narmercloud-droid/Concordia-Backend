/**
 * Export Kempen menu catalog (categories, items, variants, add-ons) for translation.
 * Usage: node scripts/export-menu-catalog.mjs [branchId] [outputPath]
 */
import fs from "fs"

const branchId = process.argv[2] ?? "concordia-kempen"
const outPath = process.argv[3] ?? "src/i18n/menu/de.json"
const base = process.env.API_BASE ?? "https://concordia-backend-web.onrender.com"

const menuRes = await fetch(`${base}/api/branches/${branchId}/menu`)
const menuJson = await menuRes.json()
const cats = menuJson.data?.categories ?? menuJson.categories ?? []

const catalog = {
  branchId,
  categories: {},
  items: {},
  variantGroups: {},
  variants: {},
  addOnGroups: {},
  addOns: {}
}

for (const cat of cats) {
  catalog.categories[String(cat.id)] = {
    name: cat.name,
    description: cat.description ?? null
  }

  for (const item of cat.items ?? []) {
    catalog.items[String(item.id)] = {
      name: item.name,
      description: item.description ?? null
    }

    const detailRes = await fetch(`${base}/api/branches/${branchId}/items/${item.id}`)
    const detailJson = await detailRes.json()
    const d = detailJson.data ?? detailJson

    for (const g of d.variantGroups ?? []) {
      catalog.variantGroups[g.id] = { name: g.name }
      for (const v of g.options ?? []) {
        catalog.variants[v.id] = { name: v.name }
      }
    }
    for (const g of d.addOnGroups ?? []) {
      catalog.addOnGroups[g.id] = { name: g.name }
      for (const o of g.options ?? []) {
        catalog.addOns[o.id] = { name: o.name }
      }
    }
  }
}

fs.mkdirSync(outPath.split("/").slice(0, -1).join("/"), { recursive: true })
fs.writeFileSync(outPath, `${JSON.stringify(catalog, null, 2)}\n`)

const counts = Object.fromEntries(
  Object.entries(catalog)
    .filter(([k]) => k !== "branchId")
    .map(([k, v]) => [k, Object.keys(v).length])
)
console.log("Wrote", outPath)
console.log(counts)
