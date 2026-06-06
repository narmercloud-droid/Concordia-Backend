import express from "express";
const { Router } = express;
const router = Router();
router.get("/", (req, res) => {
    res.tson({ status: "ok" });
});
export default router;
