import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        default: ''
    }
},{
    timestamps: true
});

const khataSchema = new mongoose.Schema({
    buyerName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED'],
        default: 'PENDING'
    },
    payments: [paymentSchema],
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
khataSchema.index({ userId: 1, status: 1 });
khataSchema.index({ shopId: 1, status: 1 });

const Khata = mongoose.model('Khata', khataSchema);

export default Khata; 