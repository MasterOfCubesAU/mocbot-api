import express from 'express';
import asyncHandler from 'express-async-handler';
import { fetchGuildXP, fetchUserXP, deleteGuildXP, postUserXP, updateUserXP, deleteUserXP } from '@src/xp';
import { Request, Response } from 'express';

const router = express.Router();

router.get(
  '/:guild_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await fetchGuildXP(BigInt(req.params.guild_id)));
  })
);

router.delete(
  '/:guild_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await deleteGuildXP(BigInt(req.params.guild_id)));
  })
);

router.get(
  '/:guild_id/:user_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await fetchUserXP(BigInt(req.params.guild_id), BigInt(req.params.user_id)));
  })
);

router.post(
  '/:guild_id/:user_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await postUserXP(BigInt(req.params.guild_id), BigInt(req.params.user_id)));
  })
);

router.patch(
  '/:guild_id/:user_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await updateUserXP(BigInt(req.params.guild_id), BigInt(req.params.user_id), req.body));
  })
);

router.delete(
  '/:guild_id/:user_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await deleteUserXP(BigInt(req.params.guild_id), BigInt(req.params.user_id)));
  })
);

export default router;
