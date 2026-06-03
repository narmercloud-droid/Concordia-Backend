export const cartService = {
  validateCart: async (cart, prisma) => {
    for (const item of cart.items) {
      const dbItem = await prisma.menuItem.findUnique({
        where: { id: item.itemId },
        include: { variants: true, extras: true }
      });

      if (!dbItem) throw new Error("Invalid item");

      if (item.variantId) {
        const variant = dbItem.variants.find(v => v.id === item.variantId);
        if (!variant) throw new Error("Invalid variant");
      }

      if (item.extraIds?.length) {
        for (const extraId of item.extraIds) {
          const extra = dbItem.extras.find(e => e.id === extraId);
          if (!extra) throw new Error("Invalid extra");
        }
      }
    }
  },

  calculateTotals: (cart, priceEngine) => {
    return priceEngine.calculateCartTotal(cart);
  }
};
