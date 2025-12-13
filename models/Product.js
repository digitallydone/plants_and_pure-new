// Path: models\Product.js
import mongoose from "mongoose";
import { slugify } from "@/lib/utils/format";

const VariantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  compareAtPrice: { type: Number },
  sku: { type: String },
  stock: { type: Number, default: 0 },
  image: { type: String },
});

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    images: [{ type: String }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: [{ type: String }],
    variants: [VariantSchema],
    stock: { type: Number, default: 0 },
    sku: { type: String },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    careInstructions: { type: String },
    specifications: { type: Map, of: String },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ProductSchema.pre("validate", async function (next) {
//   if (this.name && !this.slug) {
//     const baseSlug = slugify(this.name)
//     let slug = baseSlug
//     let counter = 1

//     // Ensure unique slug
//     const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema)
//     while (await Product.findOne({ slug, _id: { $ne: this._id } })) {
//       slug = `${baseSlug}-${counter}`
//       counter++
//     }
//     this.slug = slug
//   }
//   next()
// })

ProductSchema.pre("validate", async function () {
  if (this.name && !this.slug) {
    const baseSlug = slugify(this.name);
    let slug = baseSlug;
    let counter = 1;

    const Product =
      mongoose.models.Product || mongoose.model("Product", ProductSchema);

    while (await Product.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }
});

ProductSchema.index({ name: "text", description: "text", tags: "text" });
ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ averageRating: -1 });

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
