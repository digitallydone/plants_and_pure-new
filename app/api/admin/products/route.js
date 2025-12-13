// Path: app\api\admin\products\route.js
// import { NextResponse } from "next/server"
// import { getServerSession } from "next-auth"
// import dbConnect from "@/lib/db"
// import Product from "@/models/Product"
// import { authOptions } from "@/lib/auth-options"

// export async function POST(request) {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session || session.user.role !== "admin") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const data = await request.json()

//     await dbConnect()

//     // Check for duplicate slug
//     const existing = await Product.findOne({ slug: data.slug })
//     if (existing) {
//       return NextResponse.json({ error: "Product with this slug already exists" }, { status: 400 })
//     }

//     const product = await Product.create(data)

//     return NextResponse.json({ product }, { status: 201 })
//   } catch (error) {
//     console.error("Product create error:", error)
//     return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
//   }
// }

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { authOptions } from "@/lib/auth-options";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    if (!data.name || !data.description || !data.price || !data.category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    const product = await Product.create(data);

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Product create error:", error);

    // Handle duplicate slug (unique index error)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Product with this name already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
