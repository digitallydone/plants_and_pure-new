import Link from "next/link"
import { Calendar, User, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils/format"

export function BlogCard({ blog }) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <Link href={`/blog/${blog.slug}`}>
        <div className="aspect-video bg-secondary overflow-hidden">
          <img
            src={blog.coverImage || "/placeholder.svg?height=200&width=400&query=botanical plants blog"}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="capitalize text-xs">
            {blog.category.replace("-", " ")}
          </Badge>
          {blog.featured && <Badge className="text-xs">Featured</Badge>}
        </div>
        <Link href={`/blog/${blog.slug}`}>
          <h3 className="font-serif text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {blog.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{blog.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {blog.author?.name || "Admin"}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(blog.publishedAt)}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {blog.views}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
