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
    } = req.body;

    // Add debugging logs
    console.log("Received vendor ID:", vendor);
    console.log("Is valid ObjectId?:", mongoose.Types.ObjectId.isValid(vendor));

    // Validate required fields
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

    // Handle images upload
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

    // Generate product data with slug
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
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    // Return the added product details in the response
    res.json({
      success: true,
      message: "Product Added",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get A Product By Slug
export const getAProductBySlug = async (req, res) => {
  try {
    const product = await productModel.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }
    res.status(200).json({ status: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching the product",
    });
  }
};

export const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    if (products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No products found" });
    }
    res.json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;

    // Find the product by ID
    const product = await productModel.findById(id);

    // If the product is not found, respond with a 404 status
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete the product
    await productModel.findByIdAndDelete(id);

    // Respond with success
    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.error("Error removing product:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Product Info
export const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
