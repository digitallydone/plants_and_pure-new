import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Product from "@/models/Product"
import { ITEMS_PER_PAGE } from "@/lib/constants"

export async function GET(request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Number.parseInt(searchParams.get("limit")) || ITEMS_PER_PAGE
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "newest"
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const featured = searchParams.get("featured")

    // Build query
    const query = { isActive: true }

    if (category) {
      query.category = category
    }

    if (search) {
      query.$text = { $search: search }
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number.parseFloat(minPrice)
      if (maxPrice) query.price.$lte = Number.parseFloat(maxPrice)
    }

    if (featured === "true") {
      query.featured = true
    }

    // Build sort
    let sortOption = {}
    switch (sort) {
      case "price-asc":
        sortOption = { price: 1 }
        break
      case "price-desc":
        sortOption = { price: -1 }
        break
      case "rating":
        sortOption = { averageRating: -1 }
        break
      case "oldest":
        sortOption = { createdAt: 1 }
        break
      default:
        sortOption = { createdAt: -1 }
    }

    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      Product.find(query).populate("category", "name slug").sort(sortOption).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Products API error:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
