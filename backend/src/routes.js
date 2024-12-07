import express from 'express';
import ShopRoutes from './shop/routes.js';

const router = express.Router();

router.use('/shops', ShopRoutes);

export default router; 