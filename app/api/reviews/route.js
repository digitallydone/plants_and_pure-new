import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth-options"
import dbConnect from "@/lib/db"
import Review from "@/models/Review"
import Product from "@/models/Product"
import Order from "@/models/Order"

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { productId, rating, title, comment } = await request.json()

    // Check if user has purchased this product
    const hasPurchased = await Order.findOne({
      user: session.user.id,
      "items.product": productId,
      status: "delivered",
    })

    if (!hasPurchased) {
      return NextResponse.json({ error: "You must purchase this product before reviewing" }, { status: 403 })
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: session.user.id,
      product: productId,
    })

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 400 })
    }

    const review = await Review.create({
      user: session.user.id,
      product: productId,
      rating,
      title,
      comment,
    })

    // Update product rating
    const reviews = await Review.find({ product: productId, isApproved: true })
    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      numReviews: reviews.length,
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("Create review error:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
