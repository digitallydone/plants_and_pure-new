import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { cookies } from "next/headers"
import dbConnect from "@/lib/db"
import Cart from "@/models/Cart"
import Product from "@/models/Product"
import { authOptions } from "@/lib/auth-options"

async function getCartIdentifier() {
  const session = await getServerSession(authOptions)
  if (session?.user?.id) {
    return { user: session.user.id }
  }

  const cookieStore = await cookies()
  let sessionId = cookieStore.get("cart_session")?.value

  if (!sessionId) {
    sessionId = crypto.randomUUID()
  }

  return { sessionId }
}

export async function GET() {
  try {
    await dbConnect()

    const identifier = await getCartIdentifier()
    const cart = await Cart.findOne(identifier).populate({
      path: "items.product",
      select: "name slug images price stock",
    })

    if (!cart) {
      return NextResponse.json({ items: [], subtotal: 0 })
    }

    const items = cart.items.map((item) => ({
      _id: item._id,
      product: item.product,
      quantity: item.quantity,
      variant: item.variant,
      price: item.price,
    }))

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return NextResponse.json({ items, subtotal })
  } catch (error) {
    console.error("Cart GET error:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await dbConnect()

    const { productId, quantity = 1, variant } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 })
    }

    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: "Not enough stock" }, { status: 400 })
    }

    const identifier = await getCartIdentifier()
    let cart = await Cart.findOne(identifier)

    if (!cart) {
      cart = new Cart({
        ...identifier,
        items: [],
      })
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.variant === variant,
    )

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity
    } else {
      cart.items.push({
        product: productId,
        quantity,
        variant,
        price: product.price,
      })
    }

    await cart.save()

    // Set session cookie if needed
    if (identifier.sessionId) {
      const cookieStore = await cookies()
      cookieStore.set("cart_session", identifier.sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
    }

    return NextResponse.json({ message: "Item added to cart" })
  } catch (error) {
    console.error("Cart POST error:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    await dbConnect()

    const { itemId, quantity } = await request.json()

    if (!itemId || quantity < 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const identifier = await getCartIdentifier()
    const cart = await Cart.findOne(identifier)

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    if (quantity === 0) {
      cart.items = cart.items.filter((item) => item._id.toString() !== itemId)
    } else {
      const item = cart.items.find((item) => item._id.toString() === itemId)
      if (item) {
        item.quantity = quantity
      }
    }

    await cart.save()

    return NextResponse.json({ message: "Cart updated" })
  } catch (error) {
    console.error("Cart PUT error:", error)
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get("itemId")

    const identifier = await getCartIdentifier()
    const cart = await Cart.findOne(identifier)

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    if (itemId) {
      cart.items = cart.items.filter((item) => item._id.toString() !== itemId)
    } else {
      cart.items = []
    }

    await cart.save()

    return NextResponse.json({ message: "Cart updated" })
  } catch (error) {
    console.error("Cart DELETE error:", error)
    return NextResponse.json({ error: "Failed to delete from cart" }, { status: 500 })
  }
}
