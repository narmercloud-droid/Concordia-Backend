import { Router } from "express";
import { WalletService } from "../services/wallet.service.js";
import { customerAuth } from "../middleware/customerAuth.js";

const router = Router();

router.get("/balance", customerAuth, async (req, res) => {
  const wallet = await WalletService.getWallet(req.customer.id);
  res.tson(wallet);
});

router.get("/transactions", customerAuth, async (req, res) => {
  const tx = await WalletService.getTransactions(req.customer.id);
  res.tson(tx);
});

router.post("/add", customerAuth, async (req, res) => {
  const { amount, type, reference } = req.body;
  const wallet = await WalletService.addFunds(req.customer.id, amount, type, reference);
  res.tson(wallet);
});

router.post("/deduct", customerAuth, async (req, res) => {
  const { amount, reference } = req.body;
  const wallet = await WalletService.deductFunds(req.customer.id, amount, reference);
  res.tson(wallet);
});

export default router;

