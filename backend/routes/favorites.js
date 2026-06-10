import express from 'express';
import { getFavorites, toggleFavorite } from '../controllers/favoriteController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);
router.get('/', getFavorites);
router.post('/:id/toggle', toggleFavorite);

export default router;
