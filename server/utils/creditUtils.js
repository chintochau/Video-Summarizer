import User from '../models/userModel.js';

// Function to check if user has enough credits
export const checkUserCredit = async (userId, creditAmount=10) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        if (user.credits < creditAmount) {
            throw new Error('Insufficient credits');
        }

        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Function to deduct credits from user
export const deductCredits = async (userId, creditAmount=10) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        user.credits -= creditAmount;
        await user.save();

        return user.credits;
    } catch (error) {
        throw new Error(error.message);
    }
};