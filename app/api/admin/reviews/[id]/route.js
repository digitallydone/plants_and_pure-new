import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/db"
import Review from "@/models/Review"
import Product from "@/models/Product"
import { authOptions } from "@/lib/auth-options"

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    await dbConnect()

    const review = await Review.findByIdAndUpdate(id, data, { new: true })

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    // Update product average rating
    if (data.isApproved !== undefined) {
      const reviews = await Review.find({ product: review.product, isApproved: true })
      const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

      await Product.findByIdAndUpdate(review.product, {
        averageRating: avgRating,
        reviewCount: reviews.length,
      })
    }

    return NextResponse.json({ review })
  } catch (error) {
    console.error("Review update error:", error)
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await dbConnect()

    const review = await Review.findByIdAndDelete(id)

    if (review) {
      // Update product rating
      const reviews = await Review.find({ product: review.product, isApproved: true })
      const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

      await Product.findByIdAndUpdate(review.product, {
        averageRating: avgRating,
        reviewCount: reviews.length,
      })
    }

    return NextResponse.json({ message: "Review deleted" })
  } catch (error) {
    console.error("Review delete error:", error)
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
  }
}
