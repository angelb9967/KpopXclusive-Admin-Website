const express = require('express');
const newsController = require('../controllers/newsController');
const router = express.Router();

router.post('/', newsController.createNews);
router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);
router.put('/:id', newsController.updateNewsById);
router.delete('/:id', newsController.deleteNewsById);

module.exports = router;
