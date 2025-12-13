import { notFound } from "next/navigation"
import { BlogForm } from "@/components/admin/blog-form"
import dbConnect from "@/lib/db"
import Blog from "@/models/Blog"

async function getBlog(id) {
  await dbConnect()
  const blog = await Blog.findById(id).lean()
  return blog ? JSON.parse(JSON.stringify(blog)) : null
}

export default async function EditBlogPage({ params }) {
  const { id } = await params
  const blog = await getBlog(id)

  if (!blog) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Edit Blog Post</h1>
        <p className="text-muted-foreground mt-1">Update your blog post</p>
      </div>

      <BlogForm blog={blog} />
    </div>
  )
}
