import { Request, Response, NextFunction } from "express";
import { customerService } from "../services/customers.service.js";

export const CustomersController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    const customer = await customerService.register(req.body);
    res.json(customer);
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const tokens = await customerService.login(email, password);
    if (!tokens) return res.status(401).json({ error: "Invalid credentials" });
    res.json(tokens);
  },

  refresh: async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;
    const tokens = await customerService.refresh(refreshToken);
    if (!tokens) return res.status(403).json({ error: "Invalid token" });
    res.json(tokens);
  },

  profile: async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    if (!customerId) return res.status(401).json({ error: "Unauthorized" });
    const profile = await customerService.getProfile(customerId);
    res.json(profile);
  },

  addAddress: async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    if (!customerId) return res.status(401).json({ error: "Unauthorized" });
    const address = await customerService.addAddress(customerId, req.body);
    res.json(address);
  },

  listAddresses: async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    if (!customerId) return res.status(401).json({ error: "Unauthorized" });
    const addresses = await customerService.listAddresses(customerId);
    res.json(addresses);
  },

  deleteAddress: async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id;
    if (!customerId) return res.status(401).json({ error: "Unauthorized" });
    const address = await customerService.deleteAddress(req.params.id);
    res.json(address);
  }
};

