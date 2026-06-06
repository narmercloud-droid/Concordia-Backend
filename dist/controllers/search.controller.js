import { searchService } from "../services/search.service.js";
import { wrap } from "../contracts/api.js";
export const SearchController = {
    menu: wrap(async (req) => {
        const q = req.query.q;
        const customerId = req.user?.id;
        await searchService.recordSearch(q);
        const results = await searchService.searchMenu(q, customerId);
        return results;
    }),
    branches: wrap(async (req) => {
        const q = req.query.q;
        await searchService.recordSearch(q);
        const results = await searchService.searchBranches(q);
        return results;
    }),
    categories: wrap(async (req) => {
        const q = req.query.q;
        await searchService.recordSearch(q);
        const results = await searchService.searchCategories(q);
        return results;
    }),
    topSearches: wrap(async () => {
        const results = await searchService.topSearches();
        return results;
    })
};
