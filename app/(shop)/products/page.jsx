import { Suspense } from "react"
import { ProductGrid } from "@/components/products/product-grid"
import { ProductFilters } from "@/components/products/product-filters"
import { Pagination } from "@/components/products/pagination"
import { Skeleton } from "@/components/ui/skeleton"

async function getProducts(searchParams) {
  const params = new URLSearchParams()

  if (searchParams.page) params.set("page", searchParams.page)
  if (searchParams.category) params.set("category", searchParams.category)
  if (searchParams.search) params.set("search", searchParams.search)
  if (searchParams.sort) params.set("sort", searchParams.sort)
  if (searchParams.minPrice) params.set("minPrice", searchParams.minPrice)
  if (searchParams.maxPrice) params.set("maxPrice", searchParams.maxPrice)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const res = await fetch(`${baseUrl}/api/products?${params.toString()}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    return { products: [], pagination: { page: 1, pages: 1, total: 0 } }
  }

  return res.json()
}

async function getCategories() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const res = await fetch(`${baseUrl}/api/categories`, {
    cache: "no-store",
  })

  if (!res.ok) {
    return { categories: [] }
  }

  return res.json()
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams
  const [{ products, pagination }, { categories }] = await Promise.all([getProducts(params), getCategories()])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">Our Plants</h1>
        <p className="mt-2 text-muted-foreground">
          Discover our collection of beautiful, healthy plants for your home and garden.
        </p>
      </div>

      <Suspense fallback={<ProductsLoading />}>
        <ProductFilters categories={categories} />
        <ProductGrid products={products} />
        <Pagination currentPage={pagination.page} totalPages={pagination.pages} />
      </Suspense>
    </div>
  )
}
