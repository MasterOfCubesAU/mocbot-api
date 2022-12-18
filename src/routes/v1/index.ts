import express from 'express';

// Import API routes
import settings_router from './settings';
import xp_router from './xp';
import warnings_router from './warnings';

const router = express.Router();

router.use('/settings', settings_router);
router.use('/xp', xp_router);
router.use('/warnings', warnings_router);

export default router;
