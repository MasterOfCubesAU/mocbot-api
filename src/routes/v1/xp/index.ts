import express from 'express';
import asyncHandler from 'express-async-handler';
import { fetchGuildXP } from '@src/xp';

const router = express.Router();

router.get(
  '/:guild_id',
  asyncHandler(async (req, res) => {
    res.json(await fetchGuildXP(req.params.guild_id));
  })
);

router.get('/:guild_id/:user_id', (req, res) => {
  return res.json({});
});

export default router;
