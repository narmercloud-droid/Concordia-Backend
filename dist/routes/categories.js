"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("../prisma/client");
const router = (0, express_1.Router)();
// GET all categories
router.get("/", async (req, res) => {
    try {
        const categories = await client_1.prisma.category.findMany({
            orderBy: { sort_order: "asc" }
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
        const id = Number(req.params.id);
        const category = await client_1.prisma.category.findUnique({
            where: { category_id: id }
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
        const newCategory = await client_1.prisma.category.create({
            data
        });
        res.status(201).json(newCategory);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create category" });
    }
});
exports.default = router;
