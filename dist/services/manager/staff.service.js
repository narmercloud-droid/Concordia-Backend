import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { prisma } from "../../prisma/client.js";
export async function listStaff() {
    const admins = await prisma.admin.findMany({
        orderBy: { createdAt: "desc" }
    });
    const branches = await prisma.branch.findMany({ select: { id: true, name: true } });
    const branchMap = new Map(branches.map((b) => [b.id, b.name]));
    return admins.map((a) => ({
        id: a.id,
        name: a.name,
        email: a.email,
        role: a.role,
        branchId: a.branchId,
        branchName: a.branchId ? branchMap.get(a.branchId) ?? a.branchId : "All branches",
        createdAt: a.createdAt
    }));
}
export async function createStaff(input) {
    const email = input.email.trim().toLowerCase();
    if (!email || !input.name.trim() || !input.password) {
        throw new Error("Name, email, and password are required");
    }
    if (input.role === "manager" && !input.branchId) {
        throw new Error("Branch managers must be assigned to a branch");
    }
    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing)
        throw new Error("Email already in use");
    const hashed = await bcrypt.hash(input.password, 10);
    return prisma.admin.create({
        data: {
            id: randomUUID(),
            name: input.name.trim(),
            email,
            password: hashed,
            role: input.role,
            branchId: input.role === "manager" ? input.branchId : input.branchId ?? null
        }
    });
}
export async function updateStaff(id, input) {
    const admin = await prisma.admin.findUnique({ where: { id } });
    if (!admin)
        throw new Error("Staff member not found");
    if (input.role === "manager" && input.branchId === null) {
        throw new Error("Branch managers must be assigned to a branch");
    }
    if (input.email) {
        const email = input.email.trim().toLowerCase();
        const clash = await prisma.admin.findFirst({
            where: { email, NOT: { id } }
        });
        if (clash)
            throw new Error("Email already in use");
    }
    const data = {};
    if (input.name)
        data.name = input.name.trim();
    if (input.email)
        data.email = input.email.trim().toLowerCase();
    if (input.role)
        data.role = input.role;
    if (input.branchId !== undefined)
        data.branchId = input.branchId;
    if (input.password?.trim()) {
        data.password = await bcrypt.hash(input.password, 10);
    }
    return prisma.admin.update({ where: { id }, data: data });
}
export async function deleteStaff(id, requesterId) {
    if (id === requesterId) {
        throw new Error("You cannot delete your own account");
    }
    const admin = await prisma.admin.findUnique({ where: { id } });
    if (!admin)
        throw new Error("Staff member not found");
    await prisma.admin.delete({ where: { id } });
    return { success: true };
}
