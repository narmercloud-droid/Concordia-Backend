import { Router } from "express";
const router = Router();
router.get("/", async (_req, res) => {
    res.json([
        { id: 1, name: "Main Branch", address: "123 Main St" },
        { id: 2, name: "Airport Branch", address: "Terminal 1" }
    ]);
});
export default router;
