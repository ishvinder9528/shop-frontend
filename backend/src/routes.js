import express from 'express';
import shopRoutes from './components/shop/routes.js';
import userRoutes from './components/user/routes.js';

const router = express.Router();

router.use('/shops', shopRoutes);
router.use('/users', userRoutes);

export default router; 