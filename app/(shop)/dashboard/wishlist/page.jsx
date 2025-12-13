import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Heart } from "lucide-react"
import { authOptions } from "@/lib/auth-options"
import { Card, CardContent } from "@/components/ui/card"
import { ProductGrid } from "@/components/products/product-grid"
import dbConnect from "@/lib/db"
import User from "@/models/User"

async function getWishlist(userId) {
  await dbConnect()
  const user = await User.findById(userId).populate("savedProducts").lean()
  return user?.savedProducts || []
}

export default async function WishlistPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const savedProducts = await getWishlist(session.user.id)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">My Wishlist</h2>
        <p className="text-sm text-muted-foreground">Products you've saved for later</p>
      </div>

      {savedProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-medium">Your wishlist is empty</h3>
            <p className="text-sm text-muted-foreground mt-1">Save products you love to find them easily later</p>
            <Link href="/products" className="mt-4 text-sm text-primary hover:underline">
              Browse Products
            </Link>
          </CardContent>
        </Card>
      ) : (
        <ProductGrid products={savedProducts} />
      )}
    </div>
  )
}
