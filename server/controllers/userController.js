import User from "../models/userModel.js";
import userService from "../services/userService.js";
import paymentController from "./paymentController.js";


const getUserData = async (req, res) => {
  const email = req.params.email;
  try {
    let user = await userService.getUserDataByEmail(email);
    if (!user) {
      // If user doesn't exist, create a new user account
      const userData = { email }; // Assuming just email is needed to create a user
      user = await userService.createUser(userData);
      return res
        .status(201)
        .json({ message: "User created successfully", user });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};


const createUserAccount = async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await userService.createUser(userData);
    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const purchaseCredits = async (req, res) => {
  try {
    const { email, amount } = req.body;

    // Process payment using Stripe API
    const paymentResponse = await paymentController.processPayment(
      email,
      amount
    );

    if (paymentResponse.success) {
      // Update user credits after sucessful payment
      await userService.addCredits(email, amount);
      return res
        .status(200)
        .json({ message: "Credits purchased successfully." });
    } else {
      return res.status(400).json({ message: "Payment processing failed." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export default {
  getUserData,
  createUserAccount,
  purchaseCredits,
};
