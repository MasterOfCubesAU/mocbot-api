import express from 'express'

const router = express.Router()

router.get('/:guild_id', (req, res) => {
    return res.json({})
})
router.get('/:guild_id/:user_id', (req, res) => {
    return res.json({});
})

router.delete('/:warning_id', (req, res) => {
    return res.json({});
})

export default router;