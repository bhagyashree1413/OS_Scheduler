const express = require('express');
const router = express.Router();
const compareCtrl = require('../controllers/compareController');

router.post('/', compareCtrl.validate(), compareCtrl.run);

module.exports = router;
