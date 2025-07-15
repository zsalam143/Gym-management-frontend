const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const memberController = require('../controllers/memberController');
router.post('/login', adminController.login);
// router.post('/register', adminController.register); // Uncomment for first admin creation
router.get('/members/active', memberController.getActiveMembers);
router.get('/members', memberController.getAllMembers);
// Add member route
router.post('/members', memberController.addMember);

router.patch('/members/:id/toggle', memberController.toggleMemberStatus);
router.delete('/members/:id', memberController.deleteMember);

router.put('/members/:id', memberController.updateMember);

module.exports = router;