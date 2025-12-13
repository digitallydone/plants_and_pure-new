"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import useSWR from "swr"
import { Star, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ReviewForm } from "./review-form"
import { formatDate } from "@/lib/utils/format"

const fetcher = (url) => fetch(url).then((res) => res.json())

export function ProductReviews({ productSlug, productId }) {
  const { data: session } = useSession()
  const [showForm, setShowForm] = useState(false)

  const { data: reviews, isLoading } = useSWR(`/api/products/${productSlug}/reviews`, fetcher)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-serif">Customer Reviews</CardTitle>
        {session && (
          <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
            Write a Review
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-6 pb-6 border-b border-border">
            <ReviewForm productId={productId} onSuccess={() => setShowForm(false)} />
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading reviews...</div>
        ) : reviews?.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews?.map((review) => (
              <div key={review._id} className="border-b border-border pb-4 last:border-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.user?.name}</span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < review.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                </div>
                {review.title && <p className="font-medium mt-2">{review.title}</p>}
                <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
