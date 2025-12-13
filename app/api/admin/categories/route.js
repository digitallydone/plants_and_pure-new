import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/db"
import Category from "@/models/Category"
import { authOptions } from "@/lib/auth-options"

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    await dbConnect()

    const existing = await Category.findOne({ slug: data.slug })
    if (existing) {
      return NextResponse.json({ error: "Category with this slug already exists" }, { status: 400 })
    }

    const category = await Category.create(data)

    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error("Category create error:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
