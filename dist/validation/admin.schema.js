import { z } from "zod";
/** Loose object for admin CRUD bodies (categories, items, variants, etc.) */
export const adminEntityBodySchema = z.record(z.string(), z.unknown());
// ===== AUTH SCHEMAS =====
export const adminRegisterSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.string().optional().default("staff"),
});
export const adminLoginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
});
export const adminRefreshSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
});
// ===== COURIER SCHEMAS =====
export const adminCourierCreateSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Invalid phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    vehicle: z.string().optional(),
});
export const adminCourierUpdateSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(10).optional(),
    password: z.string().min(6).optional(),
    vehicle: z.string().optional(),
    active: z.boolean().optional(),
});
// ===== CUSTOMER SCHEMAS =====
export const adminCustomerFiltersSchema = z.object({
    page: z.number().int().positive().optional().default(1),
    limit: z.number().int().positive().optional().default(20),
    search: z.string().optional(),
});
export const adminCustomerUpdateSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    isBanned: z.boolean().optional(),
});
// ===== ORDER SCHEMAS =====
export const adminOrderFiltersSchema = z.object({
    status: z.string().optional(),
    customerId: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    page: z.number().int().positive().optional().default(1),
    limit: z.number().int().positive().optional().default(20),
});
export const adminOrderStatusSchema = z.object({
    status: z.enum(["pending", "accepted", "preparing", "ready_for_pickup", "picked_up", "delivered", "cancelled"]),
    estimatedTime: z.number().int().positive().optional(),
});
export const adminAssignCourierSchema = z.object({
    courierId: z.string().min(1, "Courier ID is required"),
});
