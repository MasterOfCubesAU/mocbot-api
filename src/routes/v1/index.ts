import express from 'express';

// Import API routes
import settingsRouter from './settings';
import XPRouter from './xp';
import warningsRouter from './warnings';
import verificationRouter from './verification';
import afkRouter from './afk';
import developersRouter from './developers';
import rolesRouter from './roles';
import lobbiesRouter from './lobbies';
import lobbyRouter from './lobby';

const router = express.Router();

router.use('/settings', settingsRouter);
router.use('/xp', XPRouter);
router.use('/warnings', warningsRouter);
router.use('/verification', verificationRouter);
router.use('/afk', afkRouter);
router.use('/developers', developersRouter);
router.use('/roles', rolesRouter);
router.use('/lobbies', lobbiesRouter);
router.use('/lobby', lobbyRouter);

export default router;
