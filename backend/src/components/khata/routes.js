import express from 'express';
import { auth } from '../../middleware/auth.js';
import {
    CreateKhataEntryCntrl,
    GetKhataEntriesCntrl,
    UpdateKhataPaymentCntrl,
    DeleteKhataEntryCntrl,
    GetKhataSummaryCntrl
} from './KhataController.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Khata routes
router.post('/', CreateKhataEntryCntrl);
router.get('/', GetKhataEntriesCntrl);
router.get('/summary', GetKhataSummaryCntrl);
router.put('/:id/payment', UpdateKhataPaymentCntrl);
router.delete('/:id', DeleteKhataEntryCntrl);

export default router; 