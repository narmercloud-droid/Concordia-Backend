import { adminService } from "../services/admins.service.js";
export const AdminController = {
    create: async (req, res, next) => {
        try {
            const admin = await adminService.createAdmin(req.body);
            res.json(admin);
        }
        catch (err) {
            next(err);
        }
    },
    login: async (req, res, next) => {
        try {
            const admin = await adminService.getAdminByEmail(req.body.email);
            if (!admin)
                return res.status(401).json({ error: "Invalid credentials" });
            const valid = await adminService.validatePassword(req.body.password, admin.password);
            if (!valid)
                return res.status(401).json({ error: "Invalid credentials" });
            const tokens = await adminService.generateTokens(admin);
            res.json({ admin, ...tokens });
        }
        catch (err) {
            next(err);
        }
    },
    refresh: async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken)
                return res.status(401).json({ error: "Missing token" });
            // Admin model in prisma/schema.prisma has no refreshToken field.
            // Reject to avoid Prisma type mismatch.
            return res.status(403).json({ error: "Invalid token" });
        }
        catch (err) {
            next(err);
        }
    },
    getById: async (req, res, next) => {
        try {
            const admin = await adminService.getAdminById(req.params.id);
            res.json(admin);
        }
        catch (err) {
            next(err);
        }
    },
    list: async (req, res, next) => {
        try {
            const admins = await adminService.listAdmins();
            res.json(admins);
        }
        catch (err) {
            next(err);
        }
    },
    update: async (req, res, next) => {
        try {
            const admin = await adminService.updateAdmin(req.params.id, req.body);
            res.json(admin);
        }
        catch (err) {
            next(err);
        }
    },
    delete: async (req, res, next) => {
        try {
            const admin = await adminService.deleteAdmin(req.params.id);
            res.json(admin);
        }
        catch (err) {
            next(err);
        }
    }
};
