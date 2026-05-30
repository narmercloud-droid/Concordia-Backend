type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string | null;
  notes?: string | null;
};

const STORAGE_KEY = "concordia_cart";
const emitter = new EventTarget();

const loadCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  emitter.dispatchEvent(new Event("cartUpdated"));
};

export const cart = {
  getCart: (): CartItem[] => loadCart(),

  addItem: (item: CartItem) => {
    const items = loadCart();
    const existingIndex = items.findIndex(
      stored => stored.id === item.id
    );

    if (existingIndex >= 0) {
      items[existingIndex].quantity += item.quantity;
    } else {
      items.push(item);
    }

    saveCart(items);
  },

  removeItem: (itemId: string) => {
    const items = loadCart().filter(item => item.id !== itemId);
    saveCart(items);
  },

  updateQuantity: (itemId: string, quantity: number) => {
    const items = loadCart().map(item =>
      item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    saveCart(items);
  },

  clearCart: () => {
    saveCart([]);
  },

  getTotal: () => {
    return loadCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  subscribe: (callback: () => void) => {
    emitter.addEventListener("cartUpdated", callback);
    return () => emitter.removeEventListener("cartUpdated", callback);
  }
};
