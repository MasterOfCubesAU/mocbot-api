import express from 'express'

const router = express.Router()


router.post('/:guild_id(\\d{18})', (req, res) => {
    return res.json({})
})
router.get('/:guild_id(\\d{18})', (req, res) => {
    return res.json({})
})
router.patch('/:guild_id(\\d{18})', (req, res) => {
    return res.json({})
})

export default router;