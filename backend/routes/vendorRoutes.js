import express from "express";
import { createVendor, deleteVendor, getVendorBySlug, getVendors, updateVendor }from "../controllers/vendorController.js";



const vendorRouter= express.Router();

// Create  Vendor Routes

vendorRouter.post("/",createVendor)

// Create  Vendor Routes

vendorRouter.get("/all",getVendors)


// Create  Vendor by Slug Routes

vendorRouter.get("/:slug",getVendorBySlug)


//  Update Vendor  Route

vendorRouter.put("/:id", updateVendor)

//  Delete Vendor  Route

vendorRouter.delete("/:id", deleteVendor)

export default vendorRouter;

