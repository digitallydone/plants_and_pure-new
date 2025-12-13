import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, Star, Truck, Shield, Leaf } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductGrid } from "@/components/products/product-grid"
import { formatCurrency, formatDate } from "@/lib/utils/format"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"

async function getProduct(slug) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const res = await fetch(`${baseUrl}/api/products/${slug}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    return null
  }

  return res.json()
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const data = await getProduct(slug)

  if (!data?.product) {
    return { title: "Product Not Found" }
  }

  return {
    title: `${data.product.name} | PLANTS and PURE`,
    description: data.product.shortDescription || data.product.description?.slice(0, 160),
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params
  const data = await getProduct(slug)

  if (!data?.product) {
    notFound()
  }

  const { product, reviews, relatedProducts } = data
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-primary">
          Products
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-secondary/30">
            <img
              src={product.images?.[0] || "/placeholder.svg?height=600&width=600&query=plant"}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(0, 4).map((image, i) => (
                <button key={i} className="aspect-square overflow-hidden rounded-md bg-secondary/30">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {product.category && (
            <Link
              href={`/products?category=${product.category._id}`}
              className="text-sm text-muted-foreground uppercase tracking-wider hover:text-primary"
            >
              {product.category.name}
            </Link>
          )}

          <h1 className="font-serif text-3xl font-bold mt-2">{product.name}</h1>

          {/* Rating */}
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(product.averageRating) ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3 mt-4">
            <span className="text-3xl font-bold">{formatCurrency(product.price)}</span>
            {hasDiscount && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  {formatCurrency(product.compareAtPrice)}
                </span>
                <Badge variant="destructive">
                  Save {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                </Badge>
              </>
            )}
          </div>

          {/* Short Description */}
          {product.shortDescription && <p className="mt-4 text-muted-foreground">{product.shortDescription}</p>}

          {/* Stock Status */}
          <div className="mt-6">
            {product.stock > 0 ? (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                In Stock ({product.stock} available)
              </Badge>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          {/* Add to Cart */}
          <div className="mt-6">
            <AddToCartButton product={product} />
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-secondary/50">
              <Truck className="h-5 w-5 mx-auto text-primary" />
              <p className="text-xs mt-1">Free Shipping</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/50">
              <Shield className="h-5 w-5 mx-auto text-primary" />
              <p className="text-xs mt-1">30-Day Guarantee</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/50">
              <Leaf className="h-5 w-5 mx-auto text-primary" />
              <p className="text-xs mt-1">Eco-Friendly</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="description" className="mt-12">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="care">Care Instructions</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6">
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p>{product.description}</p>
          </div>
        </TabsContent>
        <TabsContent value="care" className="mt-6">
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p>{product.careInstructions || "Care instructions will be included with your order."}</p>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          {reviews?.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-border pb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{review.user?.name?.charAt(0) || "U"}</span>
                    </div>
                    <div>
                      <p className="font-medium">{review.user?.name || "Anonymous"}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < review.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  {review.title && <p className="font-medium mt-3">{review.title}</p>}
                  <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
          )}
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts?.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-2xl font-bold mb-6">You May Also Like</h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  )
}
