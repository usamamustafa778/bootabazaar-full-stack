import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  verifyRazorpay,
  getVendorOrders,
  updateTracking,
  getTracking,
} from "../controllers/orderController.js";
import authUser from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";

const orderRouter = express.Router();

// Admin Features
orderRouter.post("/list", authUser, roleCheck('admin'), allOrders);
orderRouter.post("/status", authUser, roleCheck('admin'), updateStatus);

orderRouter.get(
  "/vendor-orders/:vendorId",
  authUser, // Middleware to verify and attach user to the request
  roleCheck("vendor"), // Middleware to ensure the user has the "vendor" role
  getVendorOrders // Controller to handle the business logic
);

// Payment Features
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);

// User Feature
orderRouter.post("/userorders", authUser, userOrders);

// verify payment
orderRouter.post("/verifyStripe", authUser, verifyStripe);
orderRouter.post("/verifyRazorpay", authUser, verifyRazorpay);

// Tracking routes
orderRouter.put("/tracking/:orderId", authUser, roleCheck('admin'), updateTracking);
orderRouter.get("/tracking/:orderId", authUser, getTracking);

export default orderRouter;
