const express = require('express');
const AuthController = require('../controllers/auth.controller');
const { authUser } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);
router.post('/logout', AuthController.logoutUser);
router.get('/me', authUser, AuthController.getMe);

module.exports = router;
