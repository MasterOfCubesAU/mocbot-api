import express from 'express';

// Import API routes
import settingsRouter from './settings';
import xpRouter from './xp';
import warningsRouter from './warnings';

const router = express.Router();

router.use('/settings', settingsRouter);
router.use('/xp', xpRouter);
router.use('/warnings', warningsRouter);

export default router;
