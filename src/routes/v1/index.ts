import express from 'express'

// Import API routes
import settingsRouter from "./settings";

const router = express.Router()

router.use("/settings", settingsRouter)

export default router;