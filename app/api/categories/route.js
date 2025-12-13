import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Category from "@/models/Category"

export async function GET() {
  try {
    await dbConnect()

    const categories = await Category.find({ isActive: true }).sort({ name: 1 }).lean()

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Categories API error:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
