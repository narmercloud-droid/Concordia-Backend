import type { Request  } from "express";
import { searchService } from "../services/search.service.ts";
import { wrap } from "../contracts/api.js";

export const SearchController = {
  menu: wrap(async (req: Request) => {
    const q = req.query.q as string;
    const customerId = req.user?.id;

    await searchService.recordSearch(q);

    const results = await searchService.searchMenu(q, customerId);
    return results;
  }),

  branches: wrap(async (req: Request) => {
    const q = req.query.q as string;
    await searchService.recordSearch(q);
    const results = await searchService.searchBranches(q);
    return results;
  }),

  categories: wrap(async (req: Request) => {
    const q = req.query.q as string;
    await searchService.recordSearch(q);
    const results = await searchService.searchCategories(q);
    return results;
  }),

  topSearches: wrap(async () => {
    const results = await searchService.topSearches();
    return results;
  })
};






