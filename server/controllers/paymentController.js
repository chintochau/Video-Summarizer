import {
  getPriceId,
  fulfillOrder,
  createOrder,
  emailCustomerAboutFailedPayment,
  extendSubscription,
} from "../services/paymentServices.js";
import { stripe } from "../config/paymentConfig.js";

export const processPayment = async (req, res) => {
  const { priceId, mode } = getPriceId(req.body);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode,
    success_url: "http://localhost:5173/pricing",
    cancel_url: "http://localhost:5173/pricing",
  });

  await createOrder({
    sessionId: session.id,
    transactionType: mode,
    item: req.body,
  });

  res.json({ url: session.url });
};

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.WH_SECRET
  // "whsec_8b1a9ace27c157b064344877c800ff786329f48d6ac782e8e489513fa378da21";

export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    console.error(err.message);
    return;
  }

  // Handle the checkout.session.completed event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      // Check if the order is paid (for example, from a card payment)
      //
      // A delayed notification payment will have an `unpaid` status, as
      // you're still waiting for funds to be transferred from the customer's
      // account.
      if (session.payment_status === "paid") {
        fulfillOrder(session);
      }

      break;
    }

    case "invoice.payment_succeeded": {
      const session = event.data.object;
      // Check if the order is paid (for example, from a card payment)
      //
      // A delayed notification payment will have an `unpaid` status, as
      // you're still waiting for funds to be transferred from the customer's
      // account.
      extendSubscription(session);
      break;
    }

    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object;

      // Fulfill the purchase...
      fulfillOrder(session);

      break;
    }

    case "checkout.session.async_payment_failed": {
      const session = event.data.object;

      // Send an email to the customer asking them to retry their order
      emailCustomerAboutFailedPayment(session);

      break;
    }
  }

  res.status(200).send("done");
};
