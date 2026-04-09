const express = require('express');
const router = express.Router();
const simCtrl = require('../controllers/simController');
const auth = require('../utils/authMiddleware');

router.post('/', auth.requireAuth, simCtrl.validate(), simCtrl.run);

module.exports = router;
