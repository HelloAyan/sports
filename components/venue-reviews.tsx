"use client"

import { useState } from "react"
import { Star, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

interface VenueReviewsProps {
  venueId: string
}

// Mock review data
const MOCK_REVIEWS = [
  {
    id: "1",
    author: "John Doe",
    avatar: "/placeholder.svg",
    rating: 5,
    date: "2024-02-01",
    content:
      "Great atmosphere for watching sports! The screens are perfectly positioned and the staff is very friendly.",
    helpful: 12,
  },
  {
    id: "2",
    author: "Jane Smith",
    avatar: "/placeholder.svg",
    rating: 4,
    date: "2024-01-28",
    content: "Good selection of beers and the food is decent. Can get quite busy during big matches.",
    helpful: 8,
  },
  // Add more reviews...
]

const RATING_DISTRIBUTION = {
  5: 45,
  4: 30,
  3: 15,
  2: 7,
  1: 3,
}

export function VenueReviews({ venueId }: VenueReviewsProps) {
  const [helpfulReviews, setHelpfulReviews] = useState<string[]>([])

  const handleHelpfulClick = (reviewId: string) => {
    setHelpfulReviews((prev) => (prev.includes(reviewId) ? prev.filter((id) => id !== reviewId) : [...prev, reviewId]))
  }

  const averageRating = MOCK_REVIEWS.reduce((acc, review) => acc + review.rating, 0) / MOCK_REVIEWS.length

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600">Based on {MOCK_REVIEWS.length} reviews</div>
          </div>
        </div>

        <div className="space-y-2">
          {Object.entries(RATING_DISTRIBUTION)
            .sort((a, b) => Number(b[0]) - Number(a[0]))
            .map(([rating, percentage]) => (
              <div key={rating} className="flex items-center gap-2">
                <div className="w-12 text-sm">{rating} stars</div>
                <Progress value={percentage} className="h-2" />
                <div className="w-12 text-sm text-right">{percentage}%</div>
              </div>
            ))}
        </div>
      </div>

      {/* Write Review Button */}
      <div className="text-center">
        <Button size="lg">Write a Review</Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {MOCK_REVIEWS.map((review) => (
          <div key={review.id} className="border-b pb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={review.avatar} />
                  <AvatarFallback>{review.author[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{review.author}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-gray-600">{review.content}</p>

            <div className="mt-4">
              <Button
                variant="ghost"
                size="sm"
                className={helpfulReviews.includes(review.id) ? "text-sports-primary" : ""}
                onClick={() => handleHelpfulClick(review.id)}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Helpful ({review.helpful + (helpfulReviews.includes(review.id) ? 1 : 0)})
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
