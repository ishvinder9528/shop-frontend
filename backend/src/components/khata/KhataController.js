import {
    CreateKhataEntryService,
    GetKhataEntriesService,
    UpdateKhataPaymentService,
    DeleteKhataEntryService,
    GetKhataSummaryService,
    UpdateKhataEntryService
} from './KhataService.js';
import logger from '../../config/logger.js';

export const CreateKhataEntryCntrl = async (req, res) => {
    try {
        const entryData = {
            ...req.body,
            userId: req.user._id,
            status: 'PENDING'
        };
        const entry = await CreateKhataEntryService(entryData);
        res.status(201).json(entry);
    } catch (error) {
        logger.error('Error creating khata entry:', error);
        res.status(400).json({ message: error.message });
    }
};

export const GetKhataEntriesCntrl = async (req, res) => {
    try {
        const filters = {
            userId: req.user._id,
            ...(req.query.shopId && { shopId: req.query.shopId })
        };
        const entries = await GetKhataEntriesService(filters);
        res.status(200).json(entries);
    } catch (error) {
        logger.error('Error fetching khata entries:', error);
        res.status(400).json({ message: error.message });
    }
};

export const UpdateKhataPaymentCntrl = async (req, res) => {
    try {
        const { action, ...paymentData } = req.body;
        const entry = await UpdateKhataPaymentService(
            req.params.id, 
            req.user._id,
            paymentData,
            action
        );
        res.status(200).json(entry);
    } catch (error) {
        logger.error('Error updating khata payment:', error);
        res.status(400).json({ message: error.message });
    }
};

export const DeleteKhataEntryCntrl = async (req, res) => {
    try {
        await DeleteKhataEntryService(req.params.id, req.user._id);
        res.status(200).json({ message: 'Khata entry deleted successfully' });
    } catch (error) {
        logger.error('Error deleting khata entry:', error);
        res.status(400).json({ message: error.message });
    }
};

export const GetKhataSummaryCntrl = async (req, res) => {
    try {
        const summary = await GetKhataSummaryService(req.user._id);
        res.status(200).json(summary);
    } catch (error) {
        logger.error('Error fetching khata summary:', error);
        res.status(400).json({ message: error.message });
    }
};

export const UpdateKhataEntryCntrl = async (req, res) => {
    try {
        const entry = await UpdateKhataEntryService(
            req.params.id,
            req.user._id,
            req.body
        );
        res.status(200).json(entry);
    } catch (error) {
        logger.error('Error updating khata entry:', error);
        res.status(400).json({ message: error.message });
    }
}; 