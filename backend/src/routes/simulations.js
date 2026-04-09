const express = require('express');
const router = express.Router();
const simCtrl = require('../controllers/simulationsController');
const auth = require('../utils/authMiddleware');

router.post('/', auth.requireAuth, simCtrl.validate(), simCtrl.create);
router.get('/', auth.requireAuth, simCtrl.list);
router.get('/:id', auth.requireAuth, simCtrl.get);
router.delete('/:id', auth.requireAuth, simCtrl.remove);

module.exports = router;
