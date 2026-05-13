import { Request, Response, NextFunction } from "express";
import { searchService } from "../services/search.service.js";

export const SearchController = {
  menu: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = req.query.q as string;
      const customerId = req.user?.id;

      await searchService.recordSearch(q);

      const results = await searchService.searchMenu(q, customerId);
      res.json(results);
    } catch (err: unknown) {
      next(err);
    }
  },

  branches: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = req.query.q as string;
      await searchService.recordSearch(q);
      const results = await searchService.searchBranches(q);
      res.json(results);
    } catch (err: unknown) {
      next(err);
    }
  },

  categories: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = req.query.q as string;
      await searchService.recordSearch(q);
      const results = await searchService.searchCategories(q);
      res.json(results);
    } catch (err: unknown) {
      next(err);
    }
  },

  topSearches: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const results = await searchService.topSearches();
      res.json(results);
    } catch (err: unknown) {
      next(err);
    }
  }
};

