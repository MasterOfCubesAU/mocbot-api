import express from 'express';
import asyncHandler from 'express-async-handler';
import { createSettings, getGuildSettings, getAllSettings, setSettings, deleteSettings, updateSettings } from '@src/settings';
import { Request, Response } from 'express';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await getAllSettings());
  })
);
router.post(
  '/:guild_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await createSettings(BigInt(req.params.guild_id), req.body));
  })
);
router.get(
  '/:guild_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await getGuildSettings(BigInt(req.params.guild_id)));
  })
);
router.put(
  '/:guild_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await setSettings(BigInt(req.params.guild_id), req.body));
  })
);
router.patch(
  '/:guild_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await updateSettings(BigInt(req.params.guild_id), req.body));
  })
);
router.delete(
  '/:guild_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await deleteSettings(BigInt(req.params.guild_id)));
  })
);

export default router;
