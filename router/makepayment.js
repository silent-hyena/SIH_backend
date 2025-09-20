import express from "express";

import Razorpay from "razorpay";
import path from "path";
import fs from "fs";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const route = express.Router();
const SECRET = process.env.JWT_SECRET;

// Example authentication middleware
async function authenticate(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) return res.json({ alert: "Authentication token is missing." });

    const payload = jwt.verify(token, SECRET);
    // req.user = await userData.findOne({ _id: payload.userId });
    req.user = { balance: 1000, mobile: "9999999999" }; // temporary for testing
    next();
  } catch (e) {
    console.log(e.message);
    return res.json({ alert: "Not authorized" });
  }
}

// Serve static files
route.use(express.static(path.resolve()));

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Read/write orders JSON
const readData = () => {
  if (fs.existsSync("orders.json")) {
    const data = fs.readFileSync("orders.json");
    return JSON.parse(data);
  }
  return [];
};

const writeData = (data) => {
  fs.writeFileSync("orders.json", JSON.stringify(data, null, 2));
};

// Initialize file
if (!fs.existsSync("orders.json")) writeData([]);

// Create order route
route.post("/create-order", async (req, res) => {
    console.log("you are at http://localhost:3000/makepayment/create-order")
  try {
    const { amount, currency = "INR", receipt, notes } = req.body;

    // if (req.user.balance < amount) {
    //   return res.json({ alert: "Not sufficient balance" });
    // }

    const options = {
      amount: amount * 100,
      currency,
      receipt,
      notes,
    };

    const order = await razorpay.orders.create(options);

    const orders = readData();
    orders.push({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: "created",
    });
    writeData(orders);

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating order");
  }
});

// Payment success page
route.get("/payment-success", (req, res) => {
  res.sendFile(path.resolve("./view/userDashboard.html"));
});

// Verify payment
route.post("/verify-payment",  async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const secret = razorpay.key_secret;
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  try {
    const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);

    if (isValidSignature) {
      const orders = readData();
      const order = orders.find((o) => o.order_id === razorpay_order_id);

      if (order) {
        order.status = "paid";
        order.payment_id = razorpay_payment_id;
        writeData(orders);

        // Save to database (example)
        // const client = await userData.findOne({ mobile: req.user.mobile });
        // client.balance -= order.amount / 100;
        // client.transactions.unshift({ amount: order.amount / 100, type: "debit", to: order.payment_id });
        // await client.save();
      }

      res.status(200).json({ status: "ok", order });
    } else {
      res.status(400).json({ status: "verification_failed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error verifying payment" });
  }
});

export default route;
