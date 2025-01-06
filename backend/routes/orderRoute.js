import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  getVendorOrders,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// Admin Features
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

const roleCheck = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Access denied: insufficient role.",
    });
  }
  next();
};

orderRouter.get(
  "/vendor-orders/:vendorId",
  authUser, // Middleware to verify and attach user to the request
  roleCheck("vendor"), // Middleware to ensure the user has the "vendor" role
  getVendorOrders // Controller to handle the business logic
);

// Payment Features
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);

// User Feature
orderRouter.post("/userorders", authUser, userOrders);

// verify payment
orderRouter.post("/verifyStripe", authUser, verifyStripe);

export default orderRouter;
