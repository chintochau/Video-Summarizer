import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['purchase_credits', 'use_service'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    // Add more fields as necessary
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

export default Transaction;
