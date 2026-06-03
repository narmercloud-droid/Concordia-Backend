import express from "express";
const { Router } = express;
import { offerService } from "../services/offer.service.ts";

const router = Router();

router.post("/validate", async (req, res) => {
  try {
    const { code, order } = req.body || {};
    if (!code) return res.status(400).json({ error: "Offer code is required." });

    const offer = await offerService.validateOffer(code, order);
    if (!offer || !offer.valid) {
      return res.status(400).json({ error: offer?.reason || "Invalid offer code." });
    }

    res.json(offer);
  } catch (_err: unknown) {
    void _err;
    res.status(500).json({ error: "Unable to validate offer." });
  }
});

export default router;

