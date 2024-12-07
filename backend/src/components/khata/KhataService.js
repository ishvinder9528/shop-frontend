import Khata from '../../models/Khata.js';
import logger from '../../config/logger.js';

export const CreateKhataEntryService = async (entryData) => {
    try {
        const entry = new Khata(entryData);
        await entry.save();
        return entry;
    } catch (error) {
        logger.error('Error in CreateKhataEntryService:', error);
        throw new Error('Failed to create khata entry');
    }
};

export const GetKhataEntriesService = async (filters) => {
    try {
        const entries = await Khata.find(filters)
            .sort({ createdAt: -1 });
        return entries;
    } catch (error) {
        logger.error('Error in GetKhataEntriesService:', error);
        throw new Error('Failed to fetch khata entries');
    }
};

export const UpdateKhataPaymentService = async (entryId, userId, paymentData) => {
    try {
        const entry = await Khata.findOne({ _id: entryId, userId });
        
        if (!entry) {
            throw new Error('Khata entry not found');
        }

        if (entry.status === 'COMPLETED') {
            throw new Error('This khata is already completed');
        }

        const newPaidAmount = entry.paidAmount + paymentData.amount;
        
        // Add payment to history
        entry.payments.push({
            amount: paymentData.amount,
            date: new Date()
        });
        
        // Update paid amount
        entry.paidAmount = newPaidAmount;

        // Check if fully paid
        if (newPaidAmount >= entry.amount) {
            entry.status = 'COMPLETED';
            entry.paidAmount = entry.amount; // Ensure we don't exceed total amount
        }

        await entry.save();
        return entry;
    } catch (error) {
        logger.error('Error in UpdateKhataPaymentService:', error);
        throw error;
    }
};

export const DeleteKhataEntryService = async (entryId, userId) => {
    try {
        const entry = await Khata.findOneAndDelete({ _id: entryId, userId });
        if (!entry) {
            throw new Error('Khata entry not found');
        }
        return entry;
    } catch (error) {
        logger.error('Error in DeleteKhataEntryService:', error);
        throw error;
    }
}; 