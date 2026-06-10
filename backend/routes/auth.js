import express from 'express';
import { body } from 'express-validator';
import { login, register, me, logout } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

const validateAuth = [
  body('email')
    .isEmail()
    .withMessage('Por favor proporciona un correo válido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
];

router.post(
  '/register',
  [
    ...validateAuth,
    body('name').trim().notEmpty().withMessage('El nombre es obligatorio')
  ],
  register
);

router.post('/login', validateAuth, login);
router.get('/me', verifyToken, me);
router.post('/logout', verifyToken, logout);

export default router;
