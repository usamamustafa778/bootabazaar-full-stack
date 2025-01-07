import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import mongoose from "mongoose";
import slugify from "slugify";

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
      vendor,
      stock,
    } = req.body;

    if (!vendor || !mongoose.Types.ObjectId.isValid(vendor)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing vendor ID",
      });
    }

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Name and description are required",
      });
    }

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];
    const images = [image1, image2, image3, image4].filter(Boolean);

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      slug: slugify(name.toLowerCase(), { strict: true }),
      description,
      category,
      price: isNaN(Number(price)) ? 0 : Number(price),
      subCategory,
      bestseller: bestseller === "true",
      sizes: sizes ? JSON.parse(sizes) : [],
      image: imagesUrl,
      vendor,
      stock: isNaN(Number(stock)) ? 0 : Number(stock),
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({
      success: true,
      message: "Product Added",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAProductBySlug = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .populate("vendor");
    if (!product) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }
    res.status(200).json({ status: true, product });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching the product",
    });
  }
};

export const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({}).populate("vendor");
    if (products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No products found" });
    }
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await productModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId).populate("vendor");
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Handle image uploads if any
    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];
    const newImages = [image1, image2, image3, image4].filter(Boolean);

    if (newImages.length > 0) {
      const imagesUrl = await Promise.all(
        newImages.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
      updateData.image = imagesUrl;
    }

    // Update slug if name is being updated
    if (updateData.name) {
      updateData.slug = slugify(updateData.name.toLowerCase(), {
        strict: true,
      });
    }

    const product = await productModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
