import express from 'express';
import asyncHandler from 'express-async-handler';
import { createSettings, getSettings, updateSettings, deleteSettings } from '@src/settings';
import { Request, Response } from 'express';

const router = express.Router();

router.post('/:guild_id', asyncHandler(async (req: Request, res: Response) => {
  res.json(await createSettings(BigInt(req.params.guild_id), req.body));
}));
router.get('/:guild_id', asyncHandler(async (req: Request, res: Response) => {
  res.json(await getSettings(BigInt(req.params.guild_id)));
}));
router.patch('/:guild_id', asyncHandler(async (req: Request, res: Response) => {
  res.json(await updateSettings(BigInt(req.params.guild_id), req.body));
}));
router.delete('/:guild_id', asyncHandler(async (req: Request, res: Response) => {
  res.json(await deleteSettings(BigInt(req.params.guild_id)));
}));

export default router;
