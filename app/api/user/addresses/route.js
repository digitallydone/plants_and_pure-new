import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import { authOptions } from "@/lib/auth-options"

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const addressData = await request.json()

    await dbConnect()

    const user = await User.findById(session.user.id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Set first address as default
    if (user.addresses.length === 0) {
      addressData.isDefault = true
    }

    user.addresses.push(addressData)
    await user.save()

    return NextResponse.json({ message: "Address added" })
  } catch (error) {
    console.error("Address add error:", error)
    return NextResponse.json({ error: "Failed to add address" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { addressId, ...addressData } = await request.json()

    await dbConnect()

    await User.updateOne(
      { _id: session.user.id, "addresses._id": addressId },
      { $set: { "addresses.$": { ...addressData, _id: addressId } } },
    )

    return NextResponse.json({ message: "Address updated" })
  } catch (error) {
    console.error("Address update error:", error)
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const addressId = searchParams.get("id")

    await dbConnect()

    await User.updateOne({ _id: session.user.id }, { $pull: { addresses: { _id: addressId } } })

    return NextResponse.json({ message: "Address deleted" })
  } catch (error) {
    console.error("Address delete error:", error)
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 })
  }
}
