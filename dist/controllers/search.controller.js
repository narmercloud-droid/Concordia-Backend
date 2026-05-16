import { searchService } from "../services/search.service.js";
export const SearchController = {
    menu: async (req, res, next) => {
        try {
            const q = req.query.q;
            const customerId = req.user?.id;
            await searchService.recordSearch(q);
            const results = await searchService.searchMenu(q, customerId);
            res.json(results);
        }
        catch (err) {
            next(err);
        }
    },
    branches: async (req, res, next) => {
        try {
            const q = req.query.q;
            await searchService.recordSearch(q);
            const results = await searchService.searchBranches(q);
            res.json(results);
        }
        catch (err) {
            next(err);
        }
    },
    categories: async (req, res, next) => {
        try {
            const q = req.query.q;
            await searchService.recordSearch(q);
            const results = await searchService.searchCategories(q);
            res.json(results);
        }
        catch (err) {
            next(err);
        }
    },
    topSearches: async (req, res, next) => {
        try {
            const results = await searchService.topSearches();
            res.json(results);
        }
        catch (err) {
            next(err);
        }
    }
};
