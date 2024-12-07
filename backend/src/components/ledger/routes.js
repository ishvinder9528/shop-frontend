import express from 'express';
import { auth } from '../../middleware/auth.js';
import {
    CreateLedgerEntryCntrl,
    GetLedgerEntriesCntrl,
    UpdateLedgerEntryCntrl,
    DeleteLedgerEntryCntrl,
    GetLedgerSummaryCntrl
} from './LedgerController.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Ledger routes
router.post('/', CreateLedgerEntryCntrl);
router.get('/', GetLedgerEntriesCntrl);
router.get('/summary', GetLedgerSummaryCntrl);
router.put('/:id', UpdateLedgerEntryCntrl);
router.delete('/:id', DeleteLedgerEntryCntrl);

export default router;