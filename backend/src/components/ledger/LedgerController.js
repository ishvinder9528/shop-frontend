import {
    CreateLedgerEntryService,
    GetLedgerEntriesService,
    UpdateLedgerEntryService,
    DeleteLedgerEntryService,
    GetLedgerSummaryService
} from './LedgerService.js';
import logger from '../../config/logger.js';

export const CreateLedgerEntryCntrl = async (req, res) => {
    try {
        const entryData = {
            ...req.body,
            userId: req.user._id
        };
        const entry = await CreateLedgerEntryService(entryData);
        res.status(201).json(entry);
    } catch (error) {
        logger.error('Error creating ledger entry:', error);
        res.status(400).json({ message: error.message });
    }
};

export const GetLedgerEntriesCntrl = async (req, res) => {
    try {
        const filters = {
            userId: req.user._id,
            ...(req.query.shopId && { shopId: req.query.shopId })
        };
        const entries = await GetLedgerEntriesService(filters);
        res.status(200).json(entries);
    } catch (error) {
        logger.error('Error fetching ledger entries:', error);
        res.status(400).json({ message: error.message });
    }
};

export const UpdateLedgerEntryCntrl = async (req, res) => {
    try {
        const entry = await UpdateLedgerEntryService(req.params.id, req.body);
        res.status(200).json(entry);
    } catch (error) {
        logger.error('Error updating ledger entry:', error);
        res.status(400).json({ message: error.message });
    }
};

export const DeleteLedgerEntryCntrl = async (req, res) => {
    try {
        await DeleteLedgerEntryService(req.params.id);
        res.status(200).json({ message: 'Entry deleted successfully' });
    } catch (error) {
        logger.error('Error deleting ledger entry:', error);
        res.status(400).json({ message: error.message });
    }
};

export const GetLedgerSummaryCntrl = async (req, res) => {
    try {
        const filters = {
            userId: req.user._id,
            ...(req.query.shopId && { shopId: req.query.shopId })
        };
        const summary = await GetLedgerSummaryService(filters);
        res.status(200).json(summary);
    } catch (error) {
        logger.error('Error fetching ledger summary:', error);
        res.status(400).json({ message: error.message });
    }
}; 