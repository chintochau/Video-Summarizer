import { loadStripe } from "@stripe/stripe-js";
const apiKey = `${import.meta.env.VITE_STRIPE_API}`;

export const stripePromise = loadStripe(apiKey)