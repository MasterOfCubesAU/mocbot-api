import express from 'express';
import asyncHandler from 'express-async-handler';
import { addVerification, getVerification, removeVerification, updateVerification } from '@src/verification';
import { Request, Response } from 'express';

const router = express.Router();

router.post(
  '/:guild_id/:user_id',
  asyncHandler(async (req: Request, res: Response) => {
    let MessageID: bigint | undefined;
    let ChannelID: bigint | undefined;
    if ('MessageID' in req.body && 'ChannelID' in req.body) {
      [MessageID, ChannelID] = [BigInt(req.body.MessageID), BigInt(req.body.ChannelID)];
    } else {
      MessageID = ChannelID = undefined;
    }
    res.json(await addVerification(BigInt(req.params.user_id), BigInt(req.params.guild_id), MessageID, ChannelID));
  })
);

router.get(
  '/:guild_id/:user_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await getVerification(BigInt(req.params.guild_id), BigInt(req.params.user_id)));
  })
);

router.delete(
  '/:guild_id/:user_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await removeVerification(BigInt(req.params.user_id), BigInt(req.params.guild_id)));
  })
);

router.patch(
  '/:guild_id/:user_id',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await updateVerification(BigInt(req.params.user_id), BigInt(req.params.guild_id), req.body));
  })
);

export default router;
