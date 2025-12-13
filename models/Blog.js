import mongoose from "mongoose"
import { slugify } from "@/lib/utils/format"

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true, maxlength: 300 },
    content: { type: String, required: true },
    coverImage: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: String,
      enum: ["plant-care", "gardening-tips", "indoor-plants", "outdoor-plants", "diy", "news"],
      default: "plant-care",
    },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
)

BlogSchema.pre("validate", async function (next) {
  if (this.title && !this.slug) {
    const baseSlug = slugify(this.title)
    let slug = baseSlug
    let counter = 1

    // Ensure unique slug
    const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema)
    while (await Blog.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }
    this.slug = slug
  }
  next()
})

BlogSchema.index({ title: "text", content: "text", tags: "text" })
BlogSchema.index({ slug: 1 })
BlogSchema.index({ category: 1 })
BlogSchema.index({ isPublished: 1, publishedAt: -1 })

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema)
