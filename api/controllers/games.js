const router = require('express').Router();

const Game = require('../models/game');

router.get('/', async (req, res) => {
    try {
        const games = await Game.all
        res.status(200).json({data: games})
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: err })
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const game = await Game.findById(id)
        res.status(200).json({data: game})
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: err })
    }
});

router.post('/', async (req, res) => {
    try {
        const game = await Game.create()
        res.status(200).json({data: game.ops[0]._id})
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: err })
    }
});

module.exports = router