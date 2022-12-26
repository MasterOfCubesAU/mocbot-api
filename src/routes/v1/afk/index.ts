import express from 'express';
import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { getAFK, insertAFK, removeAFK } from '@src/afk';

const router = express.Router();

router.get(
  '/:guild_id/:user_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await getAFK(BigInt(req.params.user_id), BigInt(req.params.guild_id)));
  })
);

router.post(
  '/:guild_id/:user_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await insertAFK(BigInt(req.params.user_id), BigInt(req.params.guild_id), req.body));
  })
);

router.delete(
  '/:guild_id/:user_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await removeAFK(BigInt(req.params.user_id), BigInt(req.params.guild_id)));
  })
);

export default router;
