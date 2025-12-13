import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import dbConnect from "@/lib/db"
import Blog from "@/models/Blog"
import { slugify } from "@/lib/utils/format"

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const blogs = await Blog.find().populate("author", "name").sort({ createdAt: -1 }).lean()

    return NextResponse.json({ blogs: JSON.parse(JSON.stringify(blogs)) })
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const data = await request.json()

    // Auto-generate slug if not provided
    if (!data.slug && data.title) {
      data.slug = slugify(data.title)
    }

    // Ensure unique slug
    const existingBlog = await Blog.findOne({ slug: data.slug })
    if (existingBlog) {
      data.slug = `${data.slug}-${Date.now()}`
    }

    // Set publishedAt if publishing
    if (data.isPublished && !data.publishedAt) {
      data.publishedAt = new Date()
    }

    const blog = await Blog.create({
      ...data,
      author: session.user.id,
    })

    return NextResponse.json({ blog: JSON.parse(JSON.stringify(blog)) }, { status: 201 })
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 })
  }
}
