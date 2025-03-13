import express from "express";
import {
  handleWebhook,
  processPayment,
} from "../controllers/paymentController.js";
const router = express.Router();
import bodyParser from "body-parser";

router.post(
  "/create-checkout-session",
  bodyParser.json({ limit: "10mb" }),
  processPayment
);

router.post(
  "/webhook",
  bodyParser.raw({ inflate: true, limit: "100kb", type: "application/json" }),
  handleWebhook
);

export default router;
