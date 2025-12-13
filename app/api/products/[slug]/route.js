import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Product from "@/models/Product"
import Review from "@/models/Review"

export async function GET(request, { params }) {
  try {
    await dbConnect()

    const { slug } = await params

    const product = await Product.findOne({ slug, isActive: true }).populate("category", "name slug").lean()

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Get approved reviews
    const reviews = await Review.find({ product: product._id, isApproved: true })
      .populate("user", "name image")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    // Get related products
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true,
    })
      .limit(4)
      .lean()

    return NextResponse.json({
      product,
      reviews,
      relatedProducts,
    })
  } catch (error) {
    console.error("Product API error:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
