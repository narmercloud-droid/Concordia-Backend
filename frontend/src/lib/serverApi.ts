import { getBackendUrl } from "./config.js";

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
};

function flattenMenu(data: unknown): MenuItem[] {
  if (!data) return [];

  if (Array.isArray(data)) {
    if (data.length > 0 && (data[0] as { menuItems?: MenuItem[] }).menuItems) {
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

async function serverFetch(path: string, init: RequestInit = {}) {
  const response = await fetch(`${getBackendUrl()}${path}`, init);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

export async function serverAuthFetch(path: string, token: string, init: RequestInit = {}) {
  return serverFetch(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {})
    },
    cache: "no-store"
  });
}

export async function fetchMenu(): Promise<{ items: MenuItem[]; error: string | null }> {
  try {
    const data = await serverFetch("/api/v1/menu", { next: { revalidate: 30 } });
    return { items: flattenMenu(data), error: null };
  } catch {
    return { items: [], error: "Unable to load menu." };
  }
}

export async function fetchOrder(orderId: string) {
  try {
    return await serverFetch(`/track/order/${encodeURIComponent(orderId)}`, { cache: "no-store" });
  } catch {
    return null;
  }
}

export async function fetchTrackDetails(token: string) {
  try {
    return await serverFetch(`/track/${encodeURIComponent(token)}`, { cache: "no-store" });
  } catch {
    return null;
  }
}

export async function fetchProfile(token: string) {
  return serverAuthFetch("/api/v1/customers/profile", token);
}

export async function fetchCustomerOrders(customerId: string, token: string) {
  return serverAuthFetch(`/orders/customer/${encodeURIComponent(customerId)}`, token);
}

export async function fetchAddresses(token: string) {
  return serverAuthFetch("/customer/addresses", token);
}
