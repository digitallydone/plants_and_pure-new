import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Blog from "@/models/Blog"

export async function GET(request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Number.parseInt(searchParams.get("limit")) || 9
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")

    const query = { isPublished: true }

    if (category && category !== "all") {
      query.category = category
    }

    if (search) {
      query.$text = { $search: search }
    }

    if (featured === "true") {
      query.featured = true
    }

    const skip = (page - 1) * limit

    const [blogs, total] = await Promise.all([
      Blog.find(query).populate("author", "name image").sort({ publishedAt: -1 }).skip(skip).limit(limit).lean(),
      Blog.countDocuments(query),
    ])

    return NextResponse.json({
      blogs: JSON.parse(JSON.stringify(blogs)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}
