import expressAsyncHandler from "express-async-handler";
import { AppError } from "../middleware/errorHandler.js";
import { Vendor } from "../models/vendorModel.js";

// @desc Creat a new vendor
// @router /api/vendor/
// @access private

export const createVendor = expressAsyncHandler(async (req, res) => {
  try {
    const newVendor = await Vendor.create(req.body);
    res.status(201).json({ status: true, data: newVendor });
  } catch (error) {
    throw new AppError(error, 400);
  }
});

// @desc Get vendors
// @router /api/vendors/
// @access public

export const getVendors = expressAsyncHandler(async (req, res) => {
  try {
    const newVendor = await Vendor.find().populate("user");
    res.status(201).json({ status: true, data: newVendor });
  } catch (error) {
    throw new AppError(error, 400);
  }
});

// @desc Get vendor by slug
// @router /api/vendor/:slug
// @access private

export const getVendorBySlug = expressAsyncHandler(async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ slug: req.params.slug }).populate(
      "user",
      "-password"
    );
    res.status(201).json({ status: true, data: vendor });
  } catch (error) {
    throw new AppError(error, 400);
  }
});

// @desc Update Vendor
// @router /api/vendor/:id
// @access private

export const updateVendor = expressAsyncHandler(async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!vendor) {
      throw new AppError("Vendor Not Found!", 404);
    }
    res.status(201).json({ status: true, data: vendor });
  } catch (error) {
    throw new AppError(error, 400);
  }
});

// @desc Delete Vendor
// @router /api/vendor/:id
// @access private

export const deleteVendor = expressAsyncHandler(async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id, req.body);
    if (!vendor) {
      throw new AppError("Vendor Not Found!", 404);
    }
    res.status(201).json({ status: true, data: vendor });
  } catch (error) {
    throw new AppError(error, 400);
  }
});
