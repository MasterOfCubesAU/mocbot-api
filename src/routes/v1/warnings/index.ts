import express from 'express';
import asyncHandler from 'express-async-handler';
import { createWarning, getUserWarnings } from '@src/warnings';
import { Request, Response } from 'express';

const router = express.Router();

router.get('/:guild_id', (req, res) => {
  return res.json({});
});
router.post('/:guild_id/:user_id', asyncHandler(async (req: Request, res: Response) => {
  res.json(await createWarning(BigInt(req.params.user_id), BigInt(req.params.guild_id), req.body.reason, req.body.adminID));
}));
router.get('/:guild_id/:user_id', asyncHandler(async (req: Request, res: Response) => {
  res.json(await getUserWarnings(BigInt(req.params.user_id), BigInt(req.params.guild_id)));
}));

router.delete('/:warning_id', (req, res) => {
  return res.json({});
});

export default router;
