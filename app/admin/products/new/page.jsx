import { ProductForm } from "@/components/admin/product-form"
import dbConnect from "@/lib/db"
import Category from "@/models/Category"

async function getCategories() {
  await dbConnect()
  return await Category.find({ isActive: true }).lean()
}

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground mt-1">Create a new product for your store</p>
      </div>

      <ProductForm categories={JSON.parse(JSON.stringify(categories))} />
    </div>
  )
}
