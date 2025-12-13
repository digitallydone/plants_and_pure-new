import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Eye, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BlogCard } from "@/components/blog/blog-card"
import { formatDate } from "@/lib/utils/format"
import dbConnect from "@/lib/db"
import Blog from "@/models/Blog"

async function getBlog(slug) {
  await dbConnect()

  const blog = await Blog.findOneAndUpdate({ slug, isPublished: true }, { $inc: { views: 1 } }, { new: true })
    .populate("author", "name image")
    .lean()

  if (!blog) return null

  const relatedBlogs = await Blog.find({
    _id: { $ne: blog._id },
    category: blog.category,
    isPublished: true,
  })
    .populate("author", "name")
    .sort({ publishedAt: -1 })
    .limit(3)
    .lean()

  return {
    blog: JSON.parse(JSON.stringify(blog)),
    relatedBlogs: JSON.parse(JSON.stringify(relatedBlogs)),
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  await dbConnect()
  const blog = await Blog.findOne({ slug, isPublished: true }).lean()

  if (!blog) {
    return { title: "Blog Not Found" }
  }

  return {
    title: `${blog.title} | Plants & Pure Blog`,
    description: blog.excerpt,
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const data = await getBlog(slug)

  if (!data) {
    notFound()
  }

  const { blog, relatedBlogs } = data

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 lg:px-8 lg:py-12">
      {/* Back Button */}
      <Link href="/blog">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Button>
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="capitalize">
            {blog.category.replace("-", " ")}
          </Badge>
          {blog.featured && <Badge>Featured</Badge>}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance mb-4">
          {blog.title}
        </h1>

        <p className="text-lg text-muted-foreground mb-6">{blog.excerpt}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-y border-border py-4">
          <span className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {blog.author?.name || "Admin"}
          </span>
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formatDate(blog.publishedAt)}
          </span>
          <span className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            {blog.views} views
          </span>
        </div>
      </header>

      {/* Cover Image */}
      {blog.coverImage && (
        <div className="aspect-video mb-8 rounded-xl overflow-hidden bg-secondary">
          <img src={blog.coverImage || "/placeholder.svg"} alt={blog.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg max-w-none prose-headings:font-serif prose-a:text-primary">
        {blog.content.split("\n").map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-border">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <section className="mt-12 pt-8 border-t border-border">
          <h2 className="font-serif text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedBlogs.map((related) => (
              <BlogCard key={related._id} blog={related} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
