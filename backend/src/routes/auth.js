const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authCtrl = require('../controllers/authController');

router.post('/register', [
  body('username').isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], authCtrl.register);

router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], authCtrl.login);

module.exports = router;
