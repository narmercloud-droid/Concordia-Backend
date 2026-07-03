const BACKEND_BASE = process.env.BACKEND_URL || "http://localhost:3001";

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
};

function flattenMenu(data: unknown): MenuItem[] {
  if (!data) return [];

  if (Array.isArray(data)) {
    if (data.length > 0 && data[0]?.menuItems) {
      return data.flatMap((category: { menuItems?: MenuItem[] }) => category.menuItems || []);
    }
    return data as MenuItem[];
  }

  if (typeof data === "object" && data !== null && "items" in data) {
    const items = (data as { items: unknown }).items;
    return flattenMenu(items);
  }

  return [];
}

export async function fetchMenu(): Promise<{ items: MenuItem[]; error: string | null }> {
  try {
    const response = await fetch(`${BACKEND_BASE}/api/v1/menu`, {
      next: { revalidate: 30 }
    });

    if (!response.ok) {
      return { items: [], error: "Unable to load menu." };
    }

    const data = await response.json();
    return { items: flattenMenu(data), error: null };
  } catch {
    return { items: [], error: "Unable to load menu." };
  }
}

export async function fetchOrder(orderId: string) {
  const response = await fetch(`${BACKEND_BASE}/track/order/${encodeURIComponent(orderId)}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function fetchTrackDetails(token: string) {
  const response = await fetch(`${BACKEND_BASE}/track/${encodeURIComponent(token)}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}
