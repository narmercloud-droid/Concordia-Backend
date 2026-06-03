export interface VariantSelectionDTO {
  variantId: string;
  optionId?: string;
  quantity?: number;
}

export interface AddonSelectionDTO {
  addonId: string;
  quantity?: number;
  price?: number;
}

export interface OrderItemDTO {
  productId: string;
  quantity: number;
  unitPrice?: number;
  variants?: VariantSelectionDTO[];
  addons?: AddonSelectionDTO[];
  note?: string;
}

export interface CreateOrderDTO {
  customerId?: string;
  items: OrderItemDTO[];
  shippingAddress?: string;
  billingAddress?: string;
  currency?: string;
  notes?: string;
  total?: number;
  metadata?: Record<string, any>;
}
