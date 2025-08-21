"use client";

import { Recipe } from "@/lib/api";
import { Clock, Star, User, Users } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { memo } from "react";

interface RecipeCardProps {
  recipe: Recipe;
  index?: number;
}

function RecipeCard({ recipe, index = 0 }: RecipeCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const isFilled = i < Math.round(rating);
      return (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 * i }}
        >
          {isFilled ? (
            <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
          ) : (
            <Star className="h-4 w-4 text-gray-300" />
          )}
        </motion.div>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link href={`/recipes/${recipe.id}`}>
        <div className="bg-white rounded-lg border border-gray-200 hover:border-black transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md">
          {recipe.imageUrl ? (
            <div className="relative overflow-hidden bg-gray-100">
              <motion.img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-48 object-cover"
                initial={{ scale: 1.02 }}
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.3 }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = target.parentElement?.querySelector(
                    "[data-fallback]",
                  ) as HTMLElement | null;
                  if (fallback) fallback.classList.remove("hidden");
                }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div
                data-fallback
                className="hidden w-full h-48 bg-gray-100 border-b border-gray-200 items-center justify-center"
              >
                <div className="text-gray-400 text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-700">
                      {recipe.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm">Image not available</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center border-b border-gray-200">
              <div className="text-gray-400 text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-700">
                    {recipe.title.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="text-sm">No Image</p>
              </div>
            </div>
          )}

          <div className="p-6">
            <motion.h3
              className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-black transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {recipe.title}
            </motion.h3>

            {recipe.description && (
              <motion.p
                className="text-gray-600 text-sm mb-4 line-clamp-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {recipe.description}
              </motion.p>
            )}

            <motion.div
              className="flex items-center justify-between text-sm text-gray-500 mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span className="truncate max-w-20">
                    {recipe.author.name}
                  </span>
                </div>
                {recipe.prepTime && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.prepTime}m</span>
                  </div>
                )}
                {recipe.servings && (
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{recipe.servings}</span>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-1">
                <div className="flex items-center space-x-0.5">
                  {renderStars(recipe.averageRating)}
                </div>
                <span className="ml-1 font-medium text-gray-700">
                  {recipe.averageRating.toFixed(1)}
                </span>
                <span className="text-gray-400">({recipe._count.ratings})</span>
              </div>

              {recipe.difficulty && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                  {recipe.difficulty}
                </span>
              )}
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default memo(RecipeCard);
