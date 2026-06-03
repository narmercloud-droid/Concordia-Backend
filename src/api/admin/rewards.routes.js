import express from 'express';
import {
  createReward,
  updateReward,
  listRewards,
  deleteReward
} from './rewards.controller.js';

const router = express.Router();

router.get('/', listRewards);
router.post('/', createReward);
router.put('/:rewardId', updateReward);
router.delete('/:rewardId', deleteReward);

export default router;
