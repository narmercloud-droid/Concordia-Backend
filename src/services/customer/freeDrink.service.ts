import { getBranchMenuForCustomer } from "./branchMenu.service.ts";

export type FreeDrinkOption = {
  id: number;
  name: string;
  label: string;
};

function isEligibleFreeDrink(name: string): boolean {
  const normalized = name.toLowerCase();
  if (normalized.includes("durstlöscher") || normalized.includes("durstloescher")) {
    return true;
  }
  if (normalized.includes("1,0l") || normalized.includes("1.0l")) {
    return false;
  }
  if (normalized.includes("0,33l") || normalized.includes("0.33l")) {
    return true;
  }
  return false;
}

function simplifyLabel(name: string): string {
  return name
    .replace(/\(MEHRWEG\)/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function getFreeDrinkOptions(
  branchId: string,
  lang?: string | null
): Promise<FreeDrinkOption[]> {
  const menu = await getBranchMenuForCustomer(branchId, lang);
  const categories = Array.isArray(menu) ? menu : (menu as { categories?: typeof menu }).categories ?? [];
  const options: FreeDrinkOption[] = [];

  for (const category of categories) {
    const isDrinks =
      category.name.toLowerCase().includes("alkoholfrei") ||
      category.name.toLowerCase().includes("getränke");
    if (!isDrinks) continue;

    for (const item of category.items ?? []) {
      if (!isEligibleFreeDrink(item.name)) continue;
      options.push({
        id: item.id,
        name: item.name,
        label: simplifyLabel(item.name)
      });
    }
  }

  options.sort((a, b) => a.label.localeCompare(b.label, "de"));
  return options;
}

export function findFreeDrinkOption(
  options: FreeDrinkOption[],
  choice: string | number | null | undefined
): FreeDrinkOption | null {
  if (choice == null || choice === "") return null;
  const asNumber = Number(choice);
  if (Number.isFinite(asNumber)) {
    return options.find((o) => o.id === asNumber) ?? null;
  }
  const asText = String(choice).trim().toLowerCase();
  return (
    options.find(
      (o) =>
        o.name.toLowerCase() === asText ||
        o.label.toLowerCase() === asText ||
        String(o.id) === asText
    ) ?? null
  );
}
