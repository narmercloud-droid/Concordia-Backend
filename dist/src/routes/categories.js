import { Router } from "express";
import { prisma } from "../prisma/client.js";
const router = Router();
// GET all categories
router.get("/", async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: "asc" }
        });
        res.json(categories);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
});
// GET category by ID
router.get("/:id", async (req, res) => {
    try {
        const category = await prisma.category.findUnique({
            where: { id: req.params.id }
        });
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json(category);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch category" });
    }
});
// CREATE category
router.post("/", async (req, res) => {
    try {
        const data = req.body;
        const newCategory = await prisma.category.create({
            data
        });
        res.status(201).json(newCategory);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create category" });
    }
});
export default router;
