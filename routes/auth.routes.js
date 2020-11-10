const express = require('express');
const router = express.Router();

const authSchemas = require('../schemas/auth_schema');
const authController = require('../controllers/auth.controller');


router.post('/register',authSchemas.registerSchema,authController.register);
router.post('/login',authSchemas.loginSchema,authController.login);
router.post('/refresh-token',authController.refreshToken);
router.post('/verify-email',authSchemas.verifyEmailSchema,authController.verifyEmail);
router.post('/forget-password',authSchemas.forgotPasswordSchema,authController.forgotPassword);
router.post('/validate-reset-token',authSchemas.validateResetTokenSchema,authController.validateResetToken);
router.post('/reset-password',authSchemas.resetPasswordSchema,authController.resetPassword);


module.exports = router;

