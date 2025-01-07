import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  slug: {
    unique: true,
    type: String,
  },

  description: {
    type: String,
    required: true,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image:
    // [String],
    {
      type: Array,
      // required: true,
    },
  category: {
    type: String,
    // required: true,
  },
  subCategory: {
    type: String,
    // required: true,
  },
  sizes: {
    type: Array,
    // required: true,
  },
  bestseller: {
    type: Boolean,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  date: {
    type: Number,
    // required: true,
  },
});

productSchema.pre("save", async function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name.toLowerCase(), { strict: true });
  }
  next();
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
