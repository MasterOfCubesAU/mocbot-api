import express from 'express';
import asyncHandler from 'express-async-handler';
import { createLobby, addLobbyUsers, deleteLobby, deleteLobbyUsers, getLobby, getLobbyUser, setLobby, updateLobby } from '@src/lobbies';
import { Request, Response } from 'express';

const router = express.Router();

router.post(
  '/:guild_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await createLobby(BigInt(req.params.guild_id), req.body));
  })
);
router.get(
  '/:guild_id/:leader_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await getLobby(BigInt(req.params.guild_id), BigInt(req.params.leader_id)));
  })
);
router.put(
  '/:guild_id/:leader_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await setLobby(BigInt(req.params.guild_id), BigInt(req.params.leader_id), req.body));
  })
);
router.patch(
  '/:guild_id/:leader_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await updateLobby(BigInt(req.params.guild_id), BigInt(req.params.leader_id), req.body));
  })
);
router.delete(
  '/:guild_id/:leader_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await deleteLobby(BigInt(req.params.guild_id), BigInt(req.params.leader_id)));
  })
);
router.get(
  '/:guild_id/:leader_id/users',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await getLobbyUser(BigInt(req.params.guild_id), BigInt(req.params.leader_id)));
  })
);
router.post(
  '/:guild_id/:leader_id/users',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await addLobbyUsers(BigInt(req.params.guild_id), BigInt(req.params.leader_id), req.body));
  })
);
router.delete(
  '/:guild_id/:leader_id/:user_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await deleteLobbyUsers(BigInt(req.params.guild_id), BigInt(req.params.leader_id), BigInt(req.params.user_id)));
  })
);

export default router;
