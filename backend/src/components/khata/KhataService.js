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

export const UpdateKhataPaymentService = async (entryId, userId, paymentData, action = 'add') => {
    try {
        const entry = await Khata.findOne({ _id: entryId, userId });
        
        if (!entry) {
            throw new Error('Khata entry not found');
        }

        if (entry.status === 'COMPLETED' && action === 'add') {
            throw new Error('This khata is already completed');
        }

        let oldAmount = 0;

        switch (action) {
            case 'add':
                entry.payments.push({
                    amount: paymentData.amount,
                    date: paymentData.date
                });
                entry.paidAmount += paymentData.amount;
                break;

            case 'edit':
                const payment = entry.payments.id(paymentData.paymentId);
                if (!payment) {
                    throw new Error('Payment not found');
                }
                oldAmount = payment.amount;
                payment.amount = paymentData.amount;
                payment.date = paymentData.date;
                entry.paidAmount = entry.paidAmount - oldAmount + paymentData.amount;
                break;

            case 'delete':
                const paymentToDelete = entry.payments.id(paymentData.paymentId);
                if (!paymentToDelete) {
                    throw new Error('Payment not found');
                }
                entry.paidAmount -= paymentToDelete.amount;
                entry.payments.pull(paymentToDelete._id);
                break;

            default:
                throw new Error('Invalid action');
        }

        if (entry.paidAmount >= entry.amount) {
            entry.status = 'COMPLETED';
            entry.paidAmount = entry.amount;
        } else {
            entry.status = 'PENDING';
        }

        await entry.save();
        
        const updatedEntry = await Khata.findById(entry._id);
        return updatedEntry;
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

export const GetKhataSummaryService = async (userId) => {
    try {
        const [totalResults, completedResults] = await Promise.all([
            // Get total amounts
            Khata.aggregate([
                { $match: { userId: userId } },
                {
                    $group: {
                        _id: null,
                        totalCredit: { $sum: '$amount' },
                        totalReceived: { $sum: '$paidAmount' }
                    }
                }
            ]),
            // Get counts by status
            Khata.aggregate([
                { $match: { userId: userId } },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);

        const summary = {
            totalCredit: totalResults[0]?.totalCredit || 0,
            totalReceived: totalResults[0]?.totalReceived || 0,
            pendingAmount: (totalResults[0]?.totalCredit || 0) - (totalResults[0]?.totalReceived || 0),
            statusCounts: completedResults.reduce((acc, curr) => {
                acc[curr._id.toLowerCase()] = curr.count;
                return acc;
            }, { pending: 0, completed: 0 })
        };

        return summary;
    } catch (error) {
        logger.error('Error in GetKhataSummaryService:', error);
        throw error;
    }
};

export const UpdateKhataEntryService = async (entryId, userId, data) => {
    try {
        const entry = await Khata.findOne({ _id: entryId, userId });
        if (!entry) {
            throw new Error('Khata entry not found');
        }

        entry.buyerName = data.buyerName;
        entry.description = data.description;

        if (data.amount !== entry.amount) {
            if (entry.paidAmount > data.amount) {
                throw new Error('New amount cannot be less than already paid amount');
            }
            entry.amount = data.amount;
            if (entry.paidAmount >= entry.amount) {
                entry.status = 'COMPLETED';
            } else {
                entry.status = 'PENDING';
            }
        }

        await entry.save();
        
        const updatedEntry = await Khata.findById(entry._id);
        return updatedEntry;
    } catch (error) {
        logger.error('Error in UpdateKhataEntryService:', error);
        throw error;
    }
}; 