import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Blog from "@/models/Blog"

export async function GET(request, { params }) {
  try {
    await dbConnect()

    const { slug } = await params

    const blog = await Blog.findOneAndUpdate({ slug, isPublished: true }, { $inc: { views: 1 } }, { new: true })
      .populate("author", "name image")
      .lean()

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // Get related blogs
    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      category: blog.category,
      isPublished: true,
    })
      .populate("author", "name")
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean()

    return NextResponse.json({
      blog: JSON.parse(JSON.stringify(blog)),
      relatedBlogs: JSON.parse(JSON.stringify(relatedBlogs)),
    })
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 })
  }
}
