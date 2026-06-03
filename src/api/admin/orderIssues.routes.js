import express from 'express';
import {
  adminListIssues,
  adminGetIssue,
  adminResolveIssue
} from './orderIssues.controller.js';

const router = express.Router();

router.get('/', adminListIssues);
router.get('/:issueId', adminGetIssue);
router.put('/:issueId', adminResolveIssue);

export default router;
