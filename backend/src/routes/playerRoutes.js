const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

router.get('/', playerController.getPlayers);
router.post('/', playerController.createPlayer);
router.get('/nationalities', playerController.getNationalities);
router.get('/clubs', playerController.getClubs);       
router.get('/versions', playerController.getVersions); 
router.get('/:id', playerController.getPlayerById);
router.put('/:id', playerController.updatePlayer);
module.exports = router;