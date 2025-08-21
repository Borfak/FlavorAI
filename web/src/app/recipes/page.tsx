"use client";

import RecipeCard from "@/components/recipes/RecipeCard";
import { Recipe, recipesAPI } from "@/lib/api";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      setSearch(searchQuery);
    }
    fetchRecipes();
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [recipes, search, sortBy, difficultyFilter, ratingFilter]);

  const fetchRecipes = async () => {
    try {
      const response = await recipesAPI.getAll();
      setRecipes(response.data);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...recipes];

    if (search.trim()) {
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(search.toLowerCase()) ||
          recipe.description?.toLowerCase().includes(search.toLowerCase()) ||
          recipe.author.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (difficultyFilter !== "all") {
      filtered = filtered.filter(
        (recipe) =>
          recipe.difficulty?.toLowerCase() === difficultyFilter.toLowerCase(),
      );
    }

    if (ratingFilter !== "all") {
      const minRating = parseFloat(ratingFilter);
      filtered = filtered.filter((recipe) => recipe.averageRating >= minRating);
    }

    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
    }

    setFilteredRecipes(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

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
          <p className="mt-4 text-gray-600 font-medium">Loading recipes...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white grid-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            All Recipes
          </h1>
          <p className="text-xl text-gray-600">
            Discover and filter through our collection of {recipes.length}{" "}
            recipes
          </p>
        </motion.div>

        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search recipes, authors, or ingredients..."
                className="w-full pl-10 pr-12 py-2 rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black text-white hover:bg-gray-900 transition"
                aria-label="Search"
                title="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredRecipes.length} of {recipes.length} recipes
            </span>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-md bg-white"
                aria-label="Sort recipes"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="rating">Top Rated</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50"
                aria-label="Toggle filters"
                title="Filters"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-md bg-white"
                aria-label="Difficulty"
              >
                <option value="all">All difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-md bg-white"
                aria-label="Minimum rating"
              >
                <option value="all">Any rating</option>
                <option value="4">4+ stars</option>
                <option value="3">3+ stars</option>
                <option value="2">2+ stars</option>
                <option value="1">1+ star</option>
              </select>
            </div>
          )}
        </motion.div>

        {filteredRecipes.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {filteredRecipes.map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <Search className="h-24 w-24 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              No recipes found
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
              {search || difficultyFilter !== "all" || ratingFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No recipes available yet"}
            </p>
            {(search ||
              difficultyFilter !== "all" ||
              ratingFilter !== "all") && (
              <motion.button
                onClick={() => {
                  setSearch("");
                  setSortBy("newest");
                  setDifficultyFilter("all");
                  setRatingFilter("all");
                }}
                className="btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear Filters
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
