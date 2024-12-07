import Ledger from '../../models/Ledger.js';
import logger from '../../config/logger.js';

export const CreateLedgerEntryService = async (entryData) => {
    try {
        const entry = new Ledger(entryData);
        await entry.save();
        return entry;
    } catch (error) {
        logger.error('Error in CreateLedgerEntryService:', error);
        throw new Error('Failed to create ledger entry');
    }
};

export const GetLedgerEntriesService = async (filters) => {
    try {
        const query = { ...filters };
        const entries = await Ledger.find(query)
            .sort({ date: -1 })
            .limit(100);
        return entries;
    } catch (error) {
        logger.error('Error in GetLedgerEntriesService:', error);
        throw new Error('Failed to fetch ledger entries');
    }
};

export const UpdateLedgerEntryService = async (entryId, updateData) => {
    try {
        const entry = await Ledger.findByIdAndUpdate(
            entryId,
            updateData,
            { new: true, runValidators: true }
        );
        if (!entry) {
            throw new Error('Ledger entry not found');
        }
        return entry;
    } catch (error) {
        logger.error('Error in UpdateLedgerEntryService:', error);
        throw new Error('Failed to update ledger entry');
    }
};

export const DeleteLedgerEntryService = async (entryId) => {
    try {
        const entry = await Ledger.findByIdAndDelete(entryId);
        if (!entry) {
            throw new Error('Ledger entry not found');
        }
        return entry;
    } catch (error) {
        logger.error('Error in DeleteLedgerEntryService:', error);
        throw new Error('Failed to delete ledger entry');
    }
};

export const GetLedgerSummaryService = async (filters) => {
    try {
        const query = { ...filters };
        
        const [summary, categorySummary] = await Promise.all([
            // Get total income and expense
            Ledger.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: '$type',
                        total: { $sum: '$amount' }
                    }
                }
            ]),
            
            // Get category-wise breakdown
            Ledger.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: {
                            category: '$category',
                            type: '$type'
                        },
                        total: { $sum: '$amount' }
                    }
                },
                { $sort: { '_id.type': 1, total: -1 } }
            ])
        ]);

        return {
            summary,
            categorySummary
        };
    } catch (error) {
        logger.error('Error in GetLedgerSummaryService:', error);
        throw new Error('Failed to fetch ledger summary');
    }
};