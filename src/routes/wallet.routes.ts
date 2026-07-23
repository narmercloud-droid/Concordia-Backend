import express from "express";
const { Router } = express;
import { WalletService } from "../services/wallet.service.ts";
import { customerAuth } from "../middleware/customerAuth.ts";

const router = Router();

router.get("/balance", customerAuth, async (req, res) => {
  const wallet = await WalletService.getWallet(req.customer.id);
  res.json(wallet);
});

router.get("/transactions", customerAuth, async (req, res) => {
  const tx = await WalletService.getTransactions(req.customer.id);
  res.json(tx);
});

router.post("/add", customerAuth, async (req, res) => {
  const { amount, type, reference } = req.body;
  const wallet = await WalletService.addFunds(req.customer.id, amount, type, reference);
  res.json(wallet);
});

router.post("/deduct", customerAuth, async (req, res) => {
  const { amount, reference } = req.body;
  const wallet = await WalletService.deductFunds(req.customer.id, amount, reference);
  res.json(wallet);
});

export default router;

