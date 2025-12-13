import { BlogForm } from "@/components/admin/blog-form"

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">New Blog Post</h1>
        <p className="text-muted-foreground mt-1">Create a new blog post for your audience</p>
      </div>

      <BlogForm />
    </div>
  )
}
