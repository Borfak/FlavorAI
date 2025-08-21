"use client";

import RecipeCard from "@/components/recipes/RecipeCard";
import { useAuth } from "@/contexts/AuthContext";
import { Recipe, recipesAPI } from "@/lib/api";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchUserRecipes = async () => {
      if (!user) {
        router.push("/auth/login");
        return;
      }

      try {
        const response = await recipesAPI.getUserRecipes();
        setRecipes(response.data);
      } catch (error) {
        console.error("Failed to fetch user recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRecipes();
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please login to view your recipes
          </h2>
          <button
            onClick={() => router.push("/auth/login")}
            className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Loading your recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Recipes</h1>
            <p className="text-gray-600 mt-2">
              {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} in your
              collection
            </p>
          </div>
          <button
            onClick={() => router.push("/recipes/add")}
            className="flex items-center bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Recipe
          </button>
        </div>

        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="h-24 w-24 mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No recipes yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start building your recipe collection by adding your first recipe.
            </p>
            <button
              onClick={() => router.push("/recipes/add")}
              className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Add Your First Recipe
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
