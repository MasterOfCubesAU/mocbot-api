import express from 'express';
import asyncHandler from 'express-async-handler';
import { createRoles, getRoles, setRoles, deleteRoles, updateRoles } from '@src/roles';
import { Request, Response } from 'express';

const router = express.Router();

router.post(
  '/:guild_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await createRoles(BigInt(req.params.guild_id), req.body));
  })
);
router.get(
  '/:guild_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await getRoles(BigInt(req.params.guild_id)));
  })
);
router.put(
  '/:guild_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await setRoles(BigInt(req.params.guild_id), req.body));
  })
);
router.patch(
  '/:guild_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await updateRoles(BigInt(req.params.guild_id), req.body));
  })
);
router.delete(
  '/:guild_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await deleteRoles(BigInt(req.params.guild_id)));
  })
);

export default router;
