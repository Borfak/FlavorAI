"use client";

import AddRecipeForm from "@/components/recipes/AddRecipeForm";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "motion/react";
import Link from "next/link";

export default function AddRecipePage() {
  const { user, loading } = useAuth();

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
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white grid-bg flex items-center justify-center">
        <motion.div
          className="text-center max-w-md mx-auto p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-black mb-4">Login Required</h1>
          <p className="text-gray-600 mb-8">
            You need to be logged in to share your delicious recipes with the
            community.
          </p>
          <div className="space-y-3">
            <Link
              href="/"
              className="btn-primary w-full inline-block text-center"
            >
              Back to Home
            </Link>
            <p className="text-sm text-gray-500">
              Use the login button in the navigation bar to sign in
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return <AddRecipeForm />;
}
