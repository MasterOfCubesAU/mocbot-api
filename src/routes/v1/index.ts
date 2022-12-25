import express from 'express';

// Import API routes
import settingsRouter from './settings';
import XPRouter from './xp';
import warningsRouter from './warnings';
import verificationRouter from './verification';

const router = express.Router();

router.use('/settings', settingsRouter);
router.use('/xp', XPRouter);
router.use('/warnings', warningsRouter);
router.use('/verification', verificationRouter);

export default router;
