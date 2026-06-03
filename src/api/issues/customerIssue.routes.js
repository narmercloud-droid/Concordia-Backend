import express from 'express';
import { reportIssue } from './customerIssue.controller.js';

const router = express.Router();

router.post('/report', reportIssue);

export default router;
