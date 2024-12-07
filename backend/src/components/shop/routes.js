import express from 'express';
import { CreateShopCntrl, DeleteShopCntrl, GetShopByIdCntrl, GetShopDataCntrl } from './ShopComponent.js';

const router = express.Router();

// Get all shops
router.get('/', GetShopDataCntrl);

// Get single shop
router.get('/:id', GetShopByIdCntrl);

// Create shop
router.post('/', CreateShopCntrl);

// Delete shop
router.delete('/:id', DeleteShopCntrl);

export default router; 