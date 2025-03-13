// userService.js backend
import User from "../models/userModel.js";

/**
 * Retrieves user data by email from the database.
 * @param {string} email - The email of the user to retrieve data for.
 * @returns {Promise<User>} The user object corresponding to the provided email.
 */
const getUserDataByEmail = async (email) => {
    return await User.findOne({ email });
};

/**
 * Creates a new user account with the provided data.
 * @param {object} userData - The data object containing user information.
 * @param {string} userData.email - The email of the user (required).
 * @returns {Promise<User>} The newly created user object.
 * @throws {Error} If the email is missing in the userData parameter.
 */
const createUser = async (userData) => {
    // Validating if userData contains email
    if (!userData.email) {
        throw new Error("Email is required to create a user.");
    }

    try {
        // Creating the user with the provided email, additional fields can be added later
        return await User.create({ email: userData.email });
    } catch (error) {
        throw new Error("Error creating user: " + error.message);
    }
};

/**
 * Adds credits to a user's account.
 * @param {string} email - The email of the user to add credits to.
 * @param {number} amount - The amount of credits to add.
 * @returns {Promise<User>} The user object after adding credits.
 * @throws {Error} If the user is not found or an error occurs while adding credits.
 */
// Add credits to a user's account
const addCredits = async (email, amount) => {
    try {
        const user = await User.findOne({ email });
        if (user) {
            user.credits += amount;
            await user.save();
            return user;
        } else {
            throw new Error("User not found. Credits cannot be added.");
        }
    } catch (error) {
        throw new Error("Error adding credits: " + error.message);
    }
};

export default { getUserDataByEmail, createUser, addCredits };
