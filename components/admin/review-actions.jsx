"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, X, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function ReviewActions({ reviewId, isApproved }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleAction(action) {
    setIsLoading(true)

    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: action === "delete" ? "DELETE" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: action !== "delete" ? JSON.stringify({ isApproved: action === "approve" }) : undefined,
      })

      if (!res.ok) {
        throw new Error("Action failed")
      }

      toast.success(action === "delete" ? "Review deleted" : `Review ${action}d`)
      router.refresh()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {!isApproved && (
        <Button size="icon" variant="ghost" onClick={() => handleAction("approve")} disabled={isLoading}>
          <Check className="h-4 w-4 text-green-600" />
        </Button>
      )}
      {isApproved && (
        <Button size="icon" variant="ghost" onClick={() => handleAction("reject")} disabled={isLoading}>
          <X className="h-4 w-4 text-orange-600" />
        </Button>
      )}
      <Button size="icon" variant="ghost" onClick={() => handleAction("delete")} disabled={isLoading}>
        <Trash className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  )
}
