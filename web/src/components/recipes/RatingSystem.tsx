"use client";

import { useAuth } from "@/contexts/AuthContext";
import { recipesAPI } from "@/lib/api";
import { Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface RatingSystemProps {
  recipeId: string;
  currentRating?: number;
  averageRating: number;
  totalRatings: number;
  onRatingUpdate?: () => void;
}

export default function RatingSystem({
  recipeId,
  currentRating,
  averageRating,
  totalRatings,
  onRatingUpdate,
}: RatingSystemProps) {
  const { user } = useAuth();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleRating = async (rating: number) => {
    if (!user) {
      toast.error("Please login to rate this recipe");
      return;
    }

    setIsSubmitting(true);
    try {
      await recipesAPI.rate(recipeId, { rating });
      toast.success("Rating submitted successfully!");
      onRatingUpdate?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isFilled = starNumber <= rating;

      return (
        <motion.button
          key={index}
          type="button"
          className={`${
            interactive
              ? "cursor-pointer hover:scale-110 transition-transform"
              : "cursor-default"
          } ${!user && interactive ? "opacity-50" : ""}`}
          onClick={() => interactive && handleRating(starNumber)}
          onMouseEnter={() => interactive && setHoveredRating(starNumber)}
          onMouseLeave={() => interactive && setHoveredRating(0)}
          disabled={isSubmitting || !user}
          whileHover={interactive ? { scale: 1.1 } : {}}
          whileTap={interactive ? { scale: 0.95 } : {}}
        >
          {isFilled ? (
            <Star className="w-6 h-6 text-yellow-400" fill="currentColor" />
          ) : (
            <Star className="w-6 h-6 text-gray-300" />
          )}
        </motion.button>
      );
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          {renderStars(Math.round(averageRating))}
        </div>
        <span className="text-sm text-gray-600">
          {averageRating.toFixed(1)} ({totalRatings} rating
          {totalRatings !== 1 ? "s" : ""})
        </span>
      </div>

      {user && (
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">
            {currentRating ? "Update your rating" : "Rate this recipe"}
          </h4>
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }, (_, index) => {
              const starNumber = index + 1;
              const isFilled =
                starNumber <= (hoveredRating || currentRating || 0);

              return (
                <motion.button
                  key={index}
                  type="button"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredRating(starNumber)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => handleRating(starNumber)}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isFilled ? (
                    <Star
                      className="w-8 h-8 text-yellow-400"
                      fill="currentColor"
                    />
                  ) : (
                    <Star className="w-8 h-8 text-gray-300 hover:text-yellow-400" />
                  )}
                </motion.button>
              );
            })}
            {isSubmitting && (
              <span className="ml-3 text-sm text-gray-600">Submitting...</span>
            )}
          </div>
        </div>
      )}

      {!user && (
        <p className="text-sm text-gray-500">
          <a href="/auth/login" className="text-black underline">
            Login
          </a>{" "}
          to rate this recipe
        </p>
      )}
    </div>
  );
}
