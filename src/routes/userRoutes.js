const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

// authentication
router.post('/signup', authController.signUp);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword,
);

router.patch('/updateMe', authController.protect, userController.updateMe);

router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.get('/', userController.getAllUsers);

module.exports = router;
