import express from 'express';
import { register, login, refresh, logout, sendResetEmail, resetPassword } from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import { emailSchema, resetPasswordSchema } from '../validationSchemas.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/send-reset-email', validateBody(emailSchema), sendResetEmail);
router.post('/reset-password', validateBody(resetPasswordSchema), resetPassword);

export default router;
