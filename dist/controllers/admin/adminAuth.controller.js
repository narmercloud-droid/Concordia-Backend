import { AdminAuthService } from "../../services/admin/adminAuth.service.js";
import { wrap, fail } from "../../contracts/api.js";
import { adminRegisterSchema, adminLoginSchema, adminRefreshSchema } from "../../validation/admin.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
const adminAuthService = new AdminAuthService();
export const AdminAuthController = {
    register: wrap(async (req) => {
        const parsed = adminRegisterSchema.safeParse(req.body);
        if (!parsed.success) {
            throw fail('VALIDATION_ERROR', validationMessage(parsed.error.issues));
        }
        const admin = await adminAuthService.register(parsed.data);
        return admin;
    }),
    login: wrap(async (req) => {
        const parsed = adminLoginSchema.safeParse(req.body);
        if (!parsed.success) {
            throw fail('VALIDATION_ERROR', validationMessage(parsed.error.issues));
        }
        const { email, password } = parsed.data;
        const tokens = await adminAuthService.login(email, password);
        if (!tokens)
            throw fail('INVALID_CREDENTIALS', 'Invalid credentials');
        return tokens;
    }),
    refresh: wrap(async (req) => {
        const parsed = adminRefreshSchema.safeParse(req.body);
        if (!parsed.success) {
            throw fail('VALIDATION_ERROR', validationMessage(parsed.error.issues));
        }
        const { refreshToken } = parsed.data;
        const tokens = await adminAuthService.refresh(refreshToken);
        if (!tokens)
            throw fail('INVALID_TOKEN', 'Invalid token');
        return tokens;
    }),
    profile: wrap(async (req) => {
        const adminId = req.user?.id;
        if (!adminId)
            throw fail('UNAUTHORIZED', 'Unauthorized');
        const profile = await adminAuthService.getProfile(adminId);
        if (!profile)
            throw fail('NOT_FOUND', 'Profile not found');
        return profile;
    })
};
