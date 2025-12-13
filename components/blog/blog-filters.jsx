"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const categories = [
  { value: "all", label: "All Categories" },
  { value: "plant-care", label: "Plant Care" },
  { value: "gardening-tips", label: "Gardening Tips" },
  { value: "indoor-plants", label: "Indoor Plants" },
  { value: "outdoor-plants", label: "Outdoor Plants" },
  { value: "diy", label: "DIY & Projects" },
  { value: "news", label: "News & Updates" },
]

export function BlogFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get("category") || "all"
  const currentSearch = searchParams.get("search") || ""

  function updateFilters(key, value) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete("page") // Reset to page 1
    router.push(`/blog?${params.toString()}`)
  }

  function handleSearch(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const search = formData.get("search")
    updateFilters("search", search)
  }

  function clearFilters() {
    router.push("/blog")
  }

  const hasFilters = currentCategory !== "all" || currentSearch

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input name="search" placeholder="Search articles..." defaultValue={currentSearch} className="pl-9" />
      </form>

      <div className="flex gap-2">
        <Select value={currentCategory} onValueChange={(val) => updateFilters("category", val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
