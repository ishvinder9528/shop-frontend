import express from 'express';
import { GetShopDataCntrl, GetShopByIdCntrl, CreateShopCntrl, DeleteShopCntrl } from './ShopComponent.js';
import { auth } from '../../middleware/auth.js';

const router = express.Router();

router.use(auth); // Protect all shop routes

router.get('/', GetShopDataCntrl);
router.get('/:id', GetShopByIdCntrl);
router.post('/', CreateShopCntrl);
router.delete('/:id', DeleteShopCntrl);

export default router; 