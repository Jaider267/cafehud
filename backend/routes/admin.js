import express from 'express';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllCafes,
  createCafe,
  updateCafe,
  deleteCafe,
  getAllReviews,
  deleteReview
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(verifyToken);
router.use(requireAdmin);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Cafe management
router.get('/cafes', getAllCafes);
router.post('/cafes', createCafe);
router.put('/cafes/:id', updateCafe);
router.delete('/cafes/:id', deleteCafe);

// Review management
router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteReview);

export default router;