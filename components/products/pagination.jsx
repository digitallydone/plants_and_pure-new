"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Pagination({ currentPage, totalPages }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function goToPage(page) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`/products?${params.toString()}`)
  }

  if (totalPages <= 1) return null

  const pages = []
  const showEllipsisStart = currentPage > 3
  const showEllipsisEnd = currentPage < totalPages - 2

  if (showEllipsisStart) {
    pages.push(1)
    if (currentPage > 4) pages.push("...")
  }

  for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
    if (!pages.includes(i)) pages.push(i)
  }

  if (showEllipsisEnd) {
    if (currentPage < totalPages - 3) pages.push("...")
    if (!pages.includes(totalPages)) pages.push(totalPages)
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button variant="outline" size="icon" disabled={currentPage <= 1} onClick={() => goToPage(currentPage - 1)}>
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="icon"
            onClick={() => goToPage(page)}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
