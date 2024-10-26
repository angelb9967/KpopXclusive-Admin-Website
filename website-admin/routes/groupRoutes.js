const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

console.log('Group Controller:', groupController);

router.post('/', groupController.createGroup);
router.get('/', groupController.getAllGroups);
router.get('/:id', groupController.getGroupById);
router.put('/:id', groupController.updateGroupById);
router.delete('/:id', groupController.deleteGroupById);

module.exports = router;
