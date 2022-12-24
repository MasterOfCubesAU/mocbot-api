import express from 'express';
import asyncHandler from 'express-async-handler';
import { createWarning, deleteGuildWarnings, deleteWarning, getUserWarnings, getGuildWarnings } from '@src/warnings';
import { Request, Response } from 'express';

const router = express.Router();

router.get('/:guild_id', asyncHandler(async (req: Request, res: Response) => {
  res.json(await getGuildWarnings(BigInt(req.params.guild_id)));
}));
router.post('/:guild_id/:user_id', asyncHandler(async (req: Request, res: Response) => {
  res.json(await createWarning(BigInt(req.params.user_id), BigInt(req.params.guild_id), req.body.reason, req.body.adminID));
}));
router.get('/:guild_id/:user_id', asyncHandler(async (req: Request, res: Response) => {
  res.json(await getUserWarnings(BigInt(req.params.user_id), BigInt(req.params.guild_id)));
}));
router.delete('/:guild_id(\\d+)', asyncHandler(async (req: Request, res: Response) => {
  res.json(await deleteGuildWarnings(BigInt(req.params.guild_id)));
}));
router.delete('/:warning_id', asyncHandler(async (req: Request, res: Response) => {
  res.json(await deleteWarning(req.params.warning_id));
}));

export default router;
