import express from 'express';
import asyncHandler from 'express-async-handler';
import { getAllLobbies, getGuildLobbies, getLobbyByUser } from '@src/lobbies';
import { Request, Response } from 'express';

const router = express.Router();

router.get(
  '/:guild_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await getGuildLobbies(BigInt(req.params.guild_id)));
  })
);

router.get(
  '/:guild_id/:user_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await getLobbyByUser(BigInt(req.params.guild_id), BigInt(req.params.user_id)));
  })
);

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await getAllLobbies());
  })
);

export default router;
