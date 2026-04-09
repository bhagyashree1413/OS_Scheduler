const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../utils/authMiddleware');

router.use(requireAuth, requireAdmin);

router.get('/users', adminCtrl.listUsers);
router.delete('/users/:id', adminCtrl.deleteUser);
router.get('/users/export', adminCtrl.exportUsers);

router.get('/simulations', adminCtrl.listSimulations);
router.delete('/simulations/:id', adminCtrl.deleteSimulation);
router.get('/simulations/export', adminCtrl.exportSimulations);

module.exports = router;
