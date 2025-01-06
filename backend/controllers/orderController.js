import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const CONFIG = {
  currency: "inr",
  deliveryCharge: 10,
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createOrderData = (userId, items, amount, address, paymentMethod) => ({
  userId,
  items,
  address,
  amount,
  paymentMethod,
  payment: false,
  date: Date.now(),
});

const clearUserCart = async (userId) => {
  await userModel.findByIdAndUpdate(userId, { cartData: {} });
};

const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const orderData = createOrderData(userId, items, amount, address, "COD");

    const newOrder = await orderModel.create(orderData);
    await clearUserCart(userId);

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: CONFIG.currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: CONFIG.currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: CONFIG.deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Verify Stripe
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;

  try {
    if (success === "true") {
      await Promise.all([
        orderModel.findByIdAndUpdate(orderId, { payment: true }),
        clearUserCart(userId),
      ]);
      return res.json({ success: true });
    }

    await orderModel.findByIdAndDelete(orderId);
    res.json({ success: false });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// All Orders data for Admin Panel and Vendor
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getVendorOrders = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { role, vendorId: tokenVendorId } = req.user;

    if (role !== "vendor" || tokenVendorId !== vendorId) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    const orders = await orderModel
      .find({ "cart.vendorId": vendorId })
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// User Order Data For Forntend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update order status from Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  verifyStripe,
  placeOrder,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
  getVendorOrders,
};
