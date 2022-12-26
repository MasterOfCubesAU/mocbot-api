import express from 'express';

// Import API routes
import settingsRouter from './settings';
import XPRouter from './xp';
import warningsRouter from './warnings';
import verificationRouter from './verification';
import afkRouter from './afk';

const router = express.Router();

router.use('/settings', settingsRouter);
router.use('/xp', XPRouter);
router.use('/warnings', warningsRouter);
router.use('/verification', verificationRouter);
router.use('/afk', afkRouter);

export default router;
