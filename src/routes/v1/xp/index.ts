import express from 'express';
import { fetchGuildXP } from '@src/xp';

const router = express.Router();

router.get('/:guild_id', (req, res) => {
  return res.json(fetchGuildXP(req.params.guild_id));
});

router.get('/:guild_id/:user_id', (req, res) => {
  return res.json({});
});

export default router;
