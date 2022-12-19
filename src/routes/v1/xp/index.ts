import express from 'express';
import asyncHandler from 'express-async-handler';
import { fetchGuildXP } from '@src/xp';
import { Request, Response } from 'express';

const router = express.Router();

router.get(
  '/:guild_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await fetchGuildXP(req.params.guild_id));
  })
);

router.get('/:guild_id/:user_id', (req: Request, res: Response) => {
  return res.json({});
});

export default router;
