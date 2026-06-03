import express from 'express';
import { createBranch, updateBranch, deleteBranch, listBranches } from './branch.controller.js';

const router = express.Router();

router.get('/', listBranches);
router.post('/', createBranch);
router.put('/:branchId', updateBranch);
router.delete('/:branchId', deleteBranch);

export default router;
