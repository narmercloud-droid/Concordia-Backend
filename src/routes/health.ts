import express from "express";
const { Router } = express;

const router = Router();

router.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;



