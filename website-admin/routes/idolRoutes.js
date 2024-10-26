const express = require('express');
const router = express.Router();
const idolController = require('../controllers/idolController');

router.post('/', idolController.createIdol);
router.get('/', idolController.getAllIdols);
router.get('/:id', idolController.getIdolById);
router.put('/:id', idolController.updateIdolById);
router.delete('/:id', idolController.deleteIdolById);

module.exports = router;
