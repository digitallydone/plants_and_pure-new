import { Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils/format"
import { ReviewActions } from "@/components/admin/review-actions"
import dbConnect from "@/lib/db"
import Review from "@/models/Review"

async function getReviews() {
  await dbConnect()
  const reviews = await Review.find()
    .populate("user", "name email")
    .populate("product", "name slug")
    .sort({ createdAt: -1 })
    .lean()
  return reviews
}

export default async function AdminReviewsPage() {
  const reviews = await getReviews()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Reviews</h1>
        <p className="text-muted-foreground mt-1">Moderate customer reviews</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reviews ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <Star className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-2">No reviews yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-medium">{review.user?.name || "Unknown"}</p>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < review.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                            />
                          ))}
                        </div>
                        {review.isFlagged && <Badge variant="destructive">Flagged</Badge>}
                        <Badge variant={review.isApproved ? "default" : "secondary"}>
                          {review.isApproved ? "Approved" : "Pending"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        On <span className="font-medium">{review.product?.name}</span> - {formatDate(review.createdAt)}
                      </p>
                      {review.title && <p className="font-medium mt-2">{review.title}</p>}
                      <p className="text-sm mt-1">{review.comment}</p>
                    </div>
                    <ReviewActions reviewId={review._id.toString()} isApproved={review.isApproved} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
