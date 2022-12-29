import express from 'express';
import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { getDevelopers } from '@src/developers';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await getDevelopers());
  })
);

export default router;
