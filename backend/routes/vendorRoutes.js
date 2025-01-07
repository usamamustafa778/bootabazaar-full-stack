import express from "express";
import {
  createStore,
  deleteVendor,
  getVendorBySlug,
  getVendors,
  updateVendor,
} from "../controllers/vendorController.js";

const vendorRouter = express.Router();

vendorRouter.post("/create-store", createStore);
vendorRouter.get("/stores-list", getVendors);
vendorRouter.get("/:slug", getVendorBySlug);
vendorRouter.put("/:id", updateVendor);
vendorRouter.delete("/:id", deleteVendor);

export default vendorRouter;
