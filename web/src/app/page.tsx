"use client";

import RecipeCard from "@/components/recipes/RecipeCard";
import Tooltip from "@/components/ui/Tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { Recipe, recipesAPI } from "@/lib/api";
import { ChefHat, Search, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const [topRecipes, setTopRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchTopRecipes = useCallback(async () => {
    try {
      const response = await recipesAPI.getAll();
      const sortedRecipes = response.data
        .sort((a: Recipe, b: Recipe) => b.averageRating - a.averageRating)
        .slice(0, 6);
      setTopRecipes(sortedRecipes);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopRecipes();
  }, [fetchTopRecipes]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (search.trim()) {
        window.location.href = `/recipes?search=${encodeURIComponent(search.trim())}`;
      } else {
        window.location.href = "/recipes";
      }
    },
    [search],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white grid-bg flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="mt-4 text-gray-600 font-medium">
            Loading delicious recipes...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white grid-bg">
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="p-4 bg-black rounded-full">
                <ChefHat className="h-12 w-12 text-white" />
              </div>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              FlavorAI
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Discover amazing recipes, rate your favorites, and share your
              culinary creations with the world
            </motion.p>

            <motion.form
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for recipes..."
                  className="w-full bg-white pr-28 pl-12 py-4 text-gray-900 border-2 border-gray-300 rounded-full text-lg focus:outline-none focus:border-black transition-colors"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black text-white hover:bg-gray-900 transition"
                  aria-label="Search"
                  title="Search"
                >
                  <Search className="h-9 w-9" />
                </button>
              </div>
            </motion.form>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <Link
                href="/recipes"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Sparkles className="h-5 w-5" />
                <span>Browse All Recipes</span>
              </Link>
              {user ? (
                <Link
                  href="/recipes/add"
                  className="btn-secondary inline-flex items-center space-x-2"
                >
                  <ChefHat className="h-5 w-5" />
                  <span>Share Your Recipe</span>
                </Link>
              ) : (
                <Tooltip content="Please login to share recipes">
                  <button
                    className="border-2 border-gray-300 text-gray-400 px-6 py-3 rounded-lg font-medium inline-flex items-center space-x-2 opacity-60 cursor-not-allowed"
                    disabled
                  >
                    <ChefHat className="h-5 w-5" />
                    <span>Share Your Recipe</span>
                  </button>
                </Tooltip>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {topRecipes.length > 0 ? (
          <>
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Top Rated Recipes
              </h2>
              <p className="text-xl text-gray-600">
                Discover the most loved recipes from our community
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {topRecipes.map((recipe, index) => (
                <RecipeCard key={recipe.id} recipe={recipe} index={index} />
              ))}
            </motion.div>
          </>
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <ChefHat className="h-24 w-24 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              No recipes yet
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
              Be the first to share a delicious recipe with our community!
            </p>
            {user ? (
              <Link
                href="/recipes/add"
                className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Add First Recipe
              </Link>
            ) : (
              <Tooltip content="Please login to add recipes">
                <button
                  className="bg-gray-400 text-white px-6 py-3 rounded-lg font-medium opacity-60 cursor-not-allowed"
                  disabled
                >
                  Add First Recipe
                </button>
              </Tooltip>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
