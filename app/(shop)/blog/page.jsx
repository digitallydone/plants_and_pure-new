import { Suspense } from "react"
import { BlogCard } from "@/components/blog/blog-card"
import { BlogFilters } from "@/components/blog/blog-filters"
import { Pagination } from "@/components/products/pagination"
import { Skeleton } from "@/components/ui/skeleton"

async function getBlogs(searchParams) {
  const params = new URLSearchParams()

  if (searchParams.page) params.set("page", searchParams.page)
  if (searchParams.category) params.set("category", searchParams.category)
  if (searchParams.search) params.set("search", searchParams.search)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const res = await fetch(`${baseUrl}/api/blogs?${params.toString()}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    return { blogs: [], pagination: { page: 1, pages: 1, total: 0 } }
  }

  return res.json()
}

function BlogsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-video rounded-lg" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  )
}

export const metadata = {
  title: "Blog | Plants & Pure",
  description: "Tips, guides, and inspiration for plant lovers. Learn about plant care, gardening, and more.",
}

export default async function BlogPage({ searchParams }) {
  const params = await searchParams
  const { blogs, pagination } = await getBlogs(params)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">Our Blog</h1>
        <p className="mt-2 text-muted-foreground">Tips, guides, and inspiration for plant lovers everywhere.</p>
      </div>

      <Suspense fallback={<BlogsLoading />}>
        <BlogFilters />

        {blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
            <Pagination currentPage={pagination.page} totalPages={pagination.pages} />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No blog posts found. Check back soon!</p>
          </div>
        )}
      </Suspense>
    </div>
  )
}
