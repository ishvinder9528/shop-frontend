import express from 'express';
import userRoutes from './components/user/routes.js';
import shopRoutes from './components/shop/routes.js';
import ledgerRoutes from './components/ledger/routes.js';
import khataRoutes from './components/khata/routes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/shops', shopRoutes);
router.use('/ledger', ledgerRoutes);
router.use('/khata', khataRoutes);

export default router; 