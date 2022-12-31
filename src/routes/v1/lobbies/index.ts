import express from 'express';
import asyncHandler from 'express-async-handler';
import { getGuildLobbies } from '@src/lobbies';
import { Request, Response } from 'express';

const router = express.Router();

router.get(
  '/:guild_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await getGuildLobbies(BigInt(req.params.guild_id)));
  })
);

export default router;
