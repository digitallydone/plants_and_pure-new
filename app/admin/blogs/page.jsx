import Link from "next/link"
import { Plus, MoreHorizontal, Edit, Trash, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDate } from "@/lib/utils/format"
import dbConnect from "@/lib/db"
import Blog from "@/models/Blog"

async function getBlogs() {
  await dbConnect()
  const blogs = await Blog.find().populate("author", "name").sort({ createdAt: -1 }).lean()
  return JSON.parse(JSON.stringify(blogs))
}

export default async function AdminBlogsPage() {
  const blogs = await getBlogs()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground mt-1">Manage your blog content</p>
        </div>
        <Link href="/admin/blogs/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts ({blogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Title</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Author</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Views</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog._id} className="border-b border-border">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {blog.coverImage && (
                          <div className="h-10 w-14 rounded-md bg-secondary overflow-hidden flex-shrink-0">
                            <img
                              src={blog.coverImage || "/placeholder.svg"}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{blog.title}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{blog.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="capitalize">
                        {blog.category.replace("-", " ")}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">{blog.author?.name || "Unknown"}</td>
                    <td className="py-3 px-4 text-sm">{blog.views}</td>
                    <td className="py-3 px-4">
                      <Badge variant={blog.isPublished ? "default" : "secondary"}>
                        {blog.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {formatDate(blog.publishedAt || blog.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {blog.isPublished && (
                            <DropdownMenuItem asChild>
                              <Link href={`/blog/${blog.slug}`} target="_blank">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/blogs/${blog._id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {blogs.length === 0 && (
              <p className="text-center py-8 text-muted-foreground">No blog posts yet. Create your first post!</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
