import express from 'express';
import userRoutes from './components/user/routes.js';
import shopRoutes from './components/shop/routes.js';
import ledgerRoutes from './components/ledger/routes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/shops', shopRoutes);
router.use('/ledger', ledgerRoutes);

export default router; 