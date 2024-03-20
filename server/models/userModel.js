import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    tier: {
        type: String,
        enum: ['free', 'payg', 'premium'],
        default: 'free',
    },
    credits: { type: Number, default: 5 },
});

const User = mongoose.model('User', UserSchema);

export default User;
