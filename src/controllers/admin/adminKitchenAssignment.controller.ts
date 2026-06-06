import { prisma } from "../../prisma/client.ts";
import { wrap, fail } from "../../contracts/api.js";

export const updateKitchenAssignment = wrap(async (req) => {
  try {
    const { itemId } = req.params;
    const { kitchen } = req.body;

    if (!["A", "B"].includes(kitchen)) {
      throw fail('INVALID_INPUT', 'Invalid kitchen');
    }

    const updated = await prisma.menuItem.update({
      where: { id: itemId },
      data: { kitchen }
    });

    return updated;
  } catch (err) {
    console.error(err);
    throw fail('INTERNAL_ERROR', 'Server error');
  }
});

