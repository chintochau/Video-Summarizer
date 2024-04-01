import { stripe } from "../config/paymentConfig.js";
import Transaction from "../models/transactionModel.js";
import User from "../models/userModel.js";

export const getPriceId = (item) => {
  const { id, amount } = item;
  let priceId;
  let mode;
  switch (id) {
    case "tier-professional":
      mode = "subscription";
      if (amount === 1) {
        priceId = "price_1P0Uo3JV7oBrUanV1mMJP43I";
      } else {
        priceId = "price_1P0UuGJV7oBrUanVGAQNHRjw";
      }
      break;
    case "credits":
      mode = "payment";
      if (amount === 200) {
        priceId = "price_1P0V6TJV7oBrUanVlDiCN0EQ";
      } else {
        priceId = "price_1P0VNZJV7oBrUanVdDsxtrQN";
      }
      break;
    default:
      break;
  }
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return { priceId, mode };
};

const getSubscriptionBillingDate = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const billingDate = new Date(subscription.current_period_end * 1000); // Convert seconds to milliseconds

    return billingDate;
  } catch (error) {
    console.error("Error retrieving subscription:", error);
    return null;
  }
};

export const fulfillOrder = async (session) => {
  // TODO: fill me in

  // subscription = subscription ID, expires_at = Subscription end time
  const { subscription } = session;
  const sessionId = session.id;
  try {
    const order = await Transaction.findOne({ sessionId });

    if (!order) {
      throw new Error("Order not found");
    }

    order.paymentStatus = "paid";
    const userId = order.user;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    switch (order.itemId) {
      case "credits":
        user.credits += order.amount;
        break;
      case "tier-professional":
        user.tier = order.itemId;
        user.subscriptionId = subscription;
        order.subscriptionId = subscription;
        user.expirationDate = await getSubscriptionBillingDate(subscription);
        break;
      case "tier-mastermind":
        user.tier = order.itemId;
        user.subscriptionId = subscription;
        order.subscriptionId = subscription;
        user.expirationDate = await getSubscriptionBillingDate(subscription);
        break;
      default:
        break;
    }

    await user.save();
    order.fulfillmentStatus = "fulfilled";
    await order.save();
  } catch (error) {
    // Properly handle errors here, for example:
    console.error("Error during order fulfillment:", error);
  }
};

export const extendSubscription = async (session) => {
  // TODO: fill me in
  // subscription = subscription ID, expires_at = Subscription end time
  const { subscription } = session;
  const sessionId = session.id;

  try {
    const user = await User.findOne({ subscriptionId: subscription });

    if (!user) {
      throw new Error("User not found");
    }

    user.subscriptionId = subscription;
    const expirationDate = await getSubscriptionBillingDate(subscription);
    user.expirationDate = expirationDate;
    await user.save();

    const existingTransaction = await Transaction.findOne({
      subscriptionId: subscription,
    }).sort({ timestamp: -1 });

    if (!existingTransaction) {
      throw new Error("No previous Order");
    }
    // Create a copy of the existing order
    const newOrder = new new Transaction({
      user: existingTransaction.user,
      type: existingTransaction.type,
      itemId: existingTransaction.itemId,
      amount: existingTransaction.amount,
      price: existingTransaction.price,
      paymentStatus: existingTransaction.paymentStatus,
      fulfillmentStatus: existingTransaction.fulfillmentStatus,
      sessionId,
      subscriptionId: existingTransaction.subscriptionId,
      // Copy any other fields as needed
    })();

    await newOrder.save();
  } catch (error) {
    // Properly handle errors here, for example:
    console.error("Error during order fulfillment:", error);
  }
};

export const createOrder = async (data) => {
  try {
    const { sessionId, transactionType, item } = data;
    const { id, amount, price, itemName, userId } = item;
    const newTransaction = new Transaction({
      user: userId,
      type: transactionType,
      amount,
      sessionId,
      itemId: id,
      price,
    });

    await newTransaction.save();
    return newTransaction;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const emailCustomerAboutFailedPayment = (session) => {
  // TODO: fill me in
  console.log("Emailing customer");
};
