import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Product from "@/models/Product"
import Review from "@/models/Review"

export async function GET(request, { params }) {
  try {
    await dbConnect()

    const { slug } = await params
    const product = await Product.findOne({ slug })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const reviews = await Review.find({ product: product._id, isApproved: true })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Get reviews error:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}
