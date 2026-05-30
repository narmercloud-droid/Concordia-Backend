import { prisma } from "../prisma/client.js";

export class MenuService {
  async createCategory(data: any): Promise<any> {
    return prisma.category.create({ data });
  }

  async updateCategory(id: string, data: any): Promise<any> {
    return prisma.category.update({ where: { id }, data });
  }

  async deleteCategory(id: string): Promise<any> {
    return prisma.category.delete({ where: { id } });
  }

  async listCategories(): Promise<any[]> {
    return prisma.category.findMany({
      orderBy: { position: "asc" },
      include: {
        menuItems: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            tags: true,
            stock: true,
            lowStockThreshold: true,
            autoDisable: true,
            kitchen: true,
            categoryId: true
          }
        }
      }
    });
  }

  async createItem(data: any): Promise<any> {
    return prisma.menuItem.create({ data });
  }

  async updateItem(id: string, data: any): Promise<any> {
    return prisma.menuItem.update({ where: { id }, data });
  }

  async deleteItem(id: string): Promise<any> {
    return prisma.menuItem.delete({ where: { id } });
  }

  async createVariant(data: any): Promise<any> {
    throw new Error("Variants are not supported by the current schema");
  }

  async updateVariant(id: string, data: any): Promise<any> {
    throw new Error("Variants are not supported by the current schema");
  }

  async deleteVariant(id: string): Promise<any> {
    throw new Error("Variants are not supported by the current schema");
  }

  async setItemAvailability(id: string, available: boolean): Promise<any> {
    const updated = await prisma.menuItem.update({
      where: { id },
      data: { autoDisable: !available }
    });

    return {
      ...updated,
      available: !updated.autoDisable
    };
  }

  async setVariantAvailability(id: string, available: boolean): Promise<any> {
    throw new Error("Variants are not supported by the current schema");
  }
}

export const menuService = new MenuService();




