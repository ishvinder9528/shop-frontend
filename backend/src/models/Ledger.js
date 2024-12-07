import mongoose from 'mongoose';

const ledgerSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: false
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
ledgerSchema.index({ userId: 1, date: -1 });
ledgerSchema.index({ shopId: 1, date: -1 });

const Ledger = mongoose.model('Ledger', ledgerSchema);

export default Ledger;