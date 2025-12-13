import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Star } from "lucide-react"
import { authOptions } from "@/lib/auth-options"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils/format"
import dbConnect from "@/lib/db"
import Review from "@/models/Review"

async function getUserReviews(userId) {
  await dbConnect()
  const reviews = await Review.find({ user: userId })
    .populate("product", "name slug images")
    .sort({ createdAt: -1 })
    .lean()
  return reviews
}

export default async function ReviewsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const reviews = await getUserReviews(session.user.id)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">My Reviews</h2>
        <p className="text-sm text-muted-foreground">Reviews you've written</p>
      </div>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Star className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-medium">No reviews yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Share your thoughts on products you've purchased</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review._id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="h-16 w-16 rounded-md bg-secondary/50 overflow-hidden flex-shrink-0">
                    <img
                      src={review.product?.images?.[0] || "/placeholder.svg?height=64&width=64&query=plant"}
                      alt={review.product?.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/products/${review.product?.slug}`} className="font-medium hover:text-primary">
                        {review.product?.name}
                      </Link>
                      <Badge variant={review.isApproved ? "secondary" : "outline"}>
                        {review.isApproved ? "Published" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < review.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                    </div>
                    {review.title && <p className="font-medium text-sm mt-2">{review.title}</p>}
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
