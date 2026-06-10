import express from 'express';
import { healthCheck, rootInfo } from '../controllers/healthController.js';

const router = express.Router();

router.get('/', rootInfo);
router.get('/health', healthCheck);

export default router;
